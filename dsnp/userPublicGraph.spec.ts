import publicGraphSchema from "./userPublicGraph";
import avro from "avro-js";

describe("Public Graph Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(publicGraphSchema);
    expect(parsed).toBeDefined();
  });
});
