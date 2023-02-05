import { calculateMemoryStart } from "../src/memoryStart";

describe("calculate memory start", () => {
  test("1 page", () => {
    expect(calculateMemoryStart(32936)).toEqual(34524);
  });

  test("multiple page", () => {
    expect(calculateMemoryStart(132936)).toEqual(134524);
  });
});
