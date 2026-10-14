import { EntityManager } from "@mikro-orm/better-sqlite";
import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Alert, Quote, Watch } from "../database/database.entities";
import { isMatched } from "../watch/watch.service";
import { Notifier, NOTIFIERS } from "./notifier";

@Injectable()
export class AlertService {
  constructor(
    private readonly em: EntityManager,
    @Inject(NOTIFIERS) private readonly notifiers: Notifier[],
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async alertWatch() {
    const em = this.em.fork();
    const watches = await em.find(
      Watch,
      { active: true },
      { populate: ["user"] },
    );
    for (const watch of watches) {
      try {
        const quote = await em.findOne(
          Quote,
          {
            symbol: watch.symbol,
            source: watch.source,
          },
          { orderBy: { collectedAt: "DESC" } },
        );
        if (quote) {
          const isMatch = isMatched(
            quote.price,
            watch.operator,
            watch.threshold,
          );
          if (isMatch) {
            const notifier = this.notifiers.find(
              (n) => n.channel === watch.user.notificationPreference,
            );
            if (notifier) {
              if ((await em.count(Alert, { watch })) > 0) {
                continue;
              }
              await notifier.send({
                to: watch.user.email,
                message: `정보 : ${watch.source} 가 목표가에 도달하엿습니다.`,
              });

              em.create(Alert, {
                watch,
                triggeredPrice: quote.price,
                channel: notifier.channel,
              });
              await em.flush();
            }
          }
        }
      } catch (e) {
        console.error(
          `watch ${watch.id} 알림 실패`,
          e instanceof Error ? e.message : e,
        );
      }
    }
  }

  async getMyAlarts(userId: number): Promise<Alert[]> {
    const alerts = await this.em.find(Alert, { watch: { user: userId } });

    return alerts;
  }
}
