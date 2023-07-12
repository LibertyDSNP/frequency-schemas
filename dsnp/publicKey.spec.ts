import publicKeySchema from "./publicKey.js";
import avro from "avro-js";

describe("Public Key Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(publicKeySchema);
    expect(parsed).toBeDefined();
  });
});
