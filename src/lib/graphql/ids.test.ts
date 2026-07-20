import { describe, expect, it } from "vitest";
import { requireGraphQLInt, toGraphQLInt } from "@/lib/graphql/ids";

describe("toGraphQLInt", () => {
  it("coerces numeric strings to integers", () => {
    expect(toGraphQLInt("1")).toBe(1);
    expect(toGraphQLInt(1)).toBe(1);
  });

  it("rejects non-integers", () => {
    expect(toGraphQLInt("1.5")).toBeNull();
    expect(toGraphQLInt("")).toBeNull();
    expect(toGraphQLInt(null)).toBeNull();
  });
});

describe("requireGraphQLInt", () => {
  it("returns integer values", () => {
    expect(requireGraphQLInt("1")).toBe(1);
  });
});
