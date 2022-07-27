import { deploy } from "./deploy";

describe("Mock Deploy", () => {
  it("does not fail", async () => {
    await expect(() => {
      return deploy();
    }).not.toThrow();
  });
});
