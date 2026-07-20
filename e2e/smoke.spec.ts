import { test, expect } from "@playwright/test";

test("public academy shell loads", async ({ page }) => {
  await page.goto("/academy/re-quest-academy");
  // When API is down, empty/error states still render branded chrome
  await expect(page.getByRole("navigation")).toBeVisible();
  await expect(page.getByRole("link", { name: "Programs" }).first()).toBeVisible();
});

test("root redirects to default academy", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/academy\/re-quest-academy/);
});

test("login page renders form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("link", { name: /forgot/i })).toBeVisible();
});

test("forgot password page renders", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { name: /reset password/i })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("reset password requires token", async ({ page }) => {
  await page.goto("/reset-password");
  await expect(page.getByText(/missing reset token/i)).toBeVisible();
});

test("programs list route loads", async ({ page }) => {
  await page.goto("/academy/re-quest-academy/courses");
  await expect(page.getByRole("navigation")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Programs" })).toBeVisible();
});
