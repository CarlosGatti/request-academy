import { describe, expect, it } from "vitest";
import { coerceIntVariables } from "@/lib/apollo/int-variables-link";

describe("coerceIntVariables", () => {
  it("coerces string ids to integers", () => {
    expect(
      coerceIntVariables({
        academyId: "1",
        input: { lessonId: "42", title: "ok", items: [{ id: "7" }] },
      }),
    ).toEqual({
      academyId: 1,
      input: { lessonId: 42, title: "ok", items: [{ id: 7 }] },
    });
  });
});
