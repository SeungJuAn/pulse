import { Injectable } from "@nestjs/common";

export const QUOTE_SOURCES = Symbol("QUOTE_SOURCES");

export abstract class QuoteSource {
  abstract readonly name: string;
  abstract fetch(symbol: string): Promise<number>;
}

@Injectable()
export class MockQuoteSourceA extends QuoteSource {
  readonly name = "mockDataA";
  async fetch(_symbol: string): Promise<number> {
    return Math.round((100 + Math.random() * 50) * 100) / 100;
  }
}
@Injectable()
export class MockQuoteSourceB extends QuoteSource {
  readonly name = "mockDataB";
  async fetch(_symbol: string): Promise<number> {
    return Math.round((100 + Math.random() * 50) * 100) / 100;
  }
}
