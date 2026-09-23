import { describe, it, expect } from "vitest";
import { pluralize, guestsWord } from "./plural";

describe("guestsWord", () => {
  it.each([
    [1, "гость"],
    [2, "гостя"],
    [4, "гостя"],
    [5, "гостей"],
    [10, "гостей"],
    [11, "гостей"], // исключение: 11–14
    [12, "гостей"],
    [21, "гость"],
    [22, "гостя"],
  ])("%i → %s", (n, word) => {
    expect(guestsWord(n)).toBe(word);
  });
});

describe("pluralize", () => {
  it("работает с любым набором форм", () => {
    const forms = ["бронь", "брони", "броней"];
    expect(pluralize(1, forms)).toBe("бронь");
    expect(pluralize(3, forms)).toBe("брони");
    expect(pluralize(7, forms)).toBe("броней");
  });
});
