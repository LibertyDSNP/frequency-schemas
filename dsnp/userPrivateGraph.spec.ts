import privateGraphSchema from "./userPrivateGraph";
import avro from "avro-js";

describe("Private Graph Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(privateGraphSchema);
    expect(parsed).toBeDefined();
  });
});
