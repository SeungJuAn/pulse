import { Controller, Get, Param } from "@nestjs/common";
import { QuoteService } from "./quote.service";

@Controller("/quotes")
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get(":symbol")
  async getLatestFromSymbol(@Param("symbol") symbol: string) {
    return this.quoteService.getLatestFromSymbol(symbol);
  }
}
