import { describe, expect } from "@jest/globals";
import { deploy } from "./deploy";

//jest.setTimeout(5000);
jest.useFakeTimers();

describe("Mock Deploy", () => {
  it("does not fail", async () => {
    await expect(() => {
      return deploy();
    }).not.toThrow();
  });
});
