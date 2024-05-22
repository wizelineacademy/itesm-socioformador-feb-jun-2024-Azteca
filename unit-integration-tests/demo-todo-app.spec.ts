import { test, expect } from "@playwright/test";

test.describe("New Todo", () => {
  test("should pass", async () => {
    const a = true;
    await expect(a).toBeTruthy();
  });
});
