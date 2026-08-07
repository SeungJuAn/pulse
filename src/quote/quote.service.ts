import { EntityManager } from "@mikro-orm/better-sqlite";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Quote } from "../database/database.entities";

@Injectable()
export class QuoteService {
  constructor(private readonly em: EntityManager) {}
  async getLatestFromSymbol(symbol: string) {
    const last = await this.em.findOne(
      Quote,
      { symbol },
      { orderBy: { collectedAt: "DESC" } },
    );
    if (!last) throw new NotFoundException(`${symbol} 시세가 존재하지앟습니다`);
    return last;
  }
}
