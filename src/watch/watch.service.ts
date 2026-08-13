import { EntityManager } from "@mikro-orm/better-sqlite";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateWatchDto } from "./dto/createWatchDto";
import { Quote, User, Watch } from "../database/database.entities";
import { UpdateWatchDto } from "./dto/updateWatchDto";
import { Matchs } from "./@types/watch.type";

@Injectable()
export class WatchService {
  constructor(private readonly em: EntityManager) {}

  async create(createWatchDto: CreateWatchDto, userId: number) {
    const watch = this.em.create(Watch, {
      ...createWatchDto,
      user: this.em.getReference(User, userId),
    });
    await this.em.flush();
    return watch.id;
  }

  async getWatchesToUser(userId: number) {
    const watches = await this.em.find(Watch, {
      user: userId,
    });
    return watches;
  }

  async updateWatch(id: number, updateWatch: UpdateWatchDto, userId: number) {
    const watch = await this.em.findOne(Watch, { id, user: userId });
    if (!watch)
      throw new NotFoundException(`해당하는 watch가 존재하지않습니다.`);
    this.em.assign(watch, updateWatch);
    await this.em.flush();

    return watch;
  }

  async removeWatch(id: number, userId: number) {
    const watch = await this.em.findOne(Watch, { id, user: userId });
    if (!watch)
      throw new NotFoundException("해당하는 watch가 존재하지않습니다.");

    this.em.remove(watch);
    await this.em.flush();
  }

  async matchs(match: Matchs): Promise<boolean> {
    const quote = await this.em.findOne(
      Quote,
      {
        symbol: match.symbol,
        source: match.source,
      },
      { orderBy: { collectedAt: "DESC" } },
    );
    if (!quote)
      throw new NotFoundException("해당하는 Quote가 존재하지않습니다.");
    return isMatched(quote.price, match.operator, match.threshold);
  }
}

export const isMatched = (
  price: number,
  operator: "<=" | ">=",
  threshold: number,
) => {
  return operator === "<=" ? price <= threshold : price >= threshold;
};
