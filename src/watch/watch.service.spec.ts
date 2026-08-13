import { isMatched } from "./watch.service";

describe("operatoreTest", () => {
  it("operator가 >= 이고 price가 threshold보다 적으면 false를 내보낸다", () => {
    const matchResultFalse = isMatched(120, ">=", 140);
    const matchResultTrue = isMatched(140, ">=", 140);
    expect(matchResultFalse).toBe(false);
    expect(matchResultTrue).toBe(true);
  });

  it("operator가 <= 이고 price가 threshold보다 적으면 false를 내보낸다", () => {
    const matchResultFalse = isMatched(150, "<=", 140);
    const matchResultTrue = isMatched(120, "<=", 140);
    expect(matchResultFalse).toBe(false);
    expect(matchResultTrue).toBe(true);
  });
});
