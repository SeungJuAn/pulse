import { Inject, Injectable } from "@nestjs/common";
import { QUOTE_SOURCES, QuoteSource } from "./quote-source";
import { EntityManager } from "@mikro-orm/better-sqlite";
import { Quote } from "../database/database.entities";
import { Cron, CronExpression } from "@nestjs/schedule";
import { QuoteGateway } from "./quote.gateway";

@Injectable()
export class QuoteCollector {
  constructor(
    @Inject(QUOTE_SOURCES) private readonly sources: QuoteSource[],
    private readonly em: EntityManager,
    private readonly gateway: QuoteGateway,
  ) {}
  private readonly symbols = ["AAPL", "TSLA"];
  @Cron(CronExpression.EVERY_10_SECONDS)
  async collect() {
    const em = this.em.fork();
    for (const symbol of this.symbols) {
      for (const source of this.sources) {
        try {
          const price = await this.fetchWithRetry(source, symbol);
          const last = await em.findOne(
            Quote,
            { source: source.name, symbol },
            { orderBy: { collectedAt: "DESC" } },
          );
          if (last?.price === price) continue;
          em.create(Quote, { symbol, source: source.name, price });
          this.gateway.broadcastQuote({ symbol, source: source.name, price });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(`${source.name} 수집 실패`, msg);
        }
      }
    }
    await em.flush();
  }
  async fetchWithRetry(
    source: QuoteSource,
    symbol: string,
    retries = 2,
  ): Promise<number> {
    for (let i = 0; i <= retries; i++) {
      try {
        return await source.fetch(symbol);
      } catch (e) {
        if (i === retries) throw e;
        await new Promise((r) => setTimeout(r, 200 * (i + 1)));
      }
    }
    throw new Error("unreachable");
  }
}
