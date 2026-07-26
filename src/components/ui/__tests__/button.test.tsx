import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, buttonClassName } from "@/components/ui/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Continue</Button>);
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("builds shared classes for link-style CTAs", () => {
    expect(buttonClassName({ variant: "highlight", size: "xl" })).toContain(
      "bg-highlight",
    );
    expect(buttonClassName({ variant: "outline-on-dark", size: "xl" })).toContain(
      "border-sea-foam/35",
    );
  });
});
