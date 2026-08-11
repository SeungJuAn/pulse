import { EntityManager } from "@mikro-orm/better-sqlite";
import { MockProxy, mock } from "jest-mock-extended";
import { QuoteGateway } from "./quote.gateway";
import { QuoteSource } from "./quote-source";
import { QuoteCollector } from "./quote-collector.service";

describe("QuoteCollector (unit)", () => {
  let forkedEm: MockProxy<EntityManager>;
  let em: MockProxy<EntityManager>;
  let gateway: MockProxy<QuoteGateway>;

  const makeSource = (name: string, price: number): QuoteSource =>
    ({
      name,
      fetch: jest.fn().mockResolvedValue(price),
    }) as unknown as QuoteSource;

  beforeEach(() => {
    forkedEm = mock<EntityManager>();
    em = mock<EntityManager>();
    (em.fork as jest.Mock).mockReturnValue(forkedEm);
    gateway = mock<QuoteGateway>();
  });

  it("직전 저장가와 같은 수면 저장하지않는다", async () => {
    const source = makeSource("a", 100);
    const collector = new QuoteCollector([source], em, gateway);
    forkedEm.findOne.mockResolvedValue({ price: 100 } as any);
    await collector.collect();

    expect(forkedEm.create).not.toHaveBeenCalled();
  });

  it("실패 시 종료되지 않고 끝까지 수집한다.", async () => {
    const good = makeSource("a", 100);
    const bad = {
      name: "bad",
      fetch: jest.fn().mockRejectedValue(new Error("다운")),
    } as unknown as QuoteSource;

    const collector = new QuoteCollector([bad, good], em, gateway);
    forkedEm.findOne.mockResolvedValue(null);
    await collector.collect();

    expect(forkedEm.create).toHaveBeenCalled();
  });
});
