import { Module } from "@nestjs/common";
import {
  MockQuoteSourceA,
  MockQuoteSourceB,
  QUOTE_SOURCES,
  QuoteSource,
} from "./quote-source";
import { QuoteCollector } from "./quote-collector.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Quote } from "../database/database.entities";
import { QuoteGateway } from "./quote.gateway";
import { QuoteController } from "./quote.controller";
import { QuoteService } from "./quote.service";

@Module({
  controllers: [QuoteController],
  imports: [MikroOrmModule.forFeature([Quote])],
  providers: [
    MockQuoteSourceA,
    MockQuoteSourceB,
    QuoteCollector,
    {
      provide: QUOTE_SOURCES,
      useFactory: (...sources: QuoteSource[]) => sources,
      inject: [MockQuoteSourceA, MockQuoteSourceB],
    },
    QuoteGateway,
    QuoteService,
  ],
})
export class QuoteModule {}
