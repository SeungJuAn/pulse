import { mock, MockProxy } from "jest-mock-extended";
import { QuoteService } from "./quote.service";
import { EntityManager } from "@mikro-orm/better-sqlite";

describe("QuoteUnitTest", () => {
  let service: QuoteService;
  let em: MockProxy<EntityManager>;

  beforeEach(() => {
    em = mock<EntityManager>();
    service = new QuoteService(em);
  });

  it("");
});
