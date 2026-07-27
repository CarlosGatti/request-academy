import { describe, expect, it } from "vitest";
import {
  requireGraphQLInt,
  toGraphQLInt,
  toInt,
  toOptionalInt,
} from "@/lib/graphql/ids";

describe("toGraphQLInt", () => {
  it("coerces numeric strings to integers", () => {
    expect(toGraphQLInt("1")).toBe(1);
    expect(toGraphQLInt(1)).toBe(1);
    expect(toGraphQLInt(" 42 ")).toBe(42);
  });

  it("rejects non-integers", () => {
    expect(toGraphQLInt("1.5")).toBeNull();
    expect(toGraphQLInt("")).toBeNull();
    expect(toGraphQLInt(null)).toBeNull();
  });
});

describe("toInt / requireGraphQLInt", () => {
  it("returns positive integers and rejects zero/strings that are not ints", () => {
    expect(toInt("1", "academyId")).toBe(1);
    expect(requireGraphQLInt("7", "courseId")).toBe(7);
    expect(() => toInt("0", "academyId")).toThrow(/positive integer/);
    expect(() => toInt("", "academyId")).toThrow(/positive integer/);
  });

  it("toOptionalInt allows empty", () => {
    expect(toOptionalInt("")).toBeUndefined();
    expect(toOptionalInt(null)).toBeUndefined();
    expect(toOptionalInt("3")).toBe(3);
  });
});
