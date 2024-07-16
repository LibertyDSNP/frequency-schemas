import profileResourceSchema from "./profileResource.js";
import avro from "avro-js";

describe("Profile Resource Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(profileResourceSchema);
    expect(parsed).toBeDefined();
  });

  it("Can buffer and unbuffer", () => {
    const parsed = avro.parse(profileResourceSchema);
    const obj = {
      type: 1,
      contentHash: Buffer.from("1e203a0393e3ee6c6fec1b13885763225fd0927884b2d431ed262899523ade281cb4", "hex"),
      length: 300,
    };
    const buf = parsed.toBuffer(obj);
    expect(buf).toHaveLength(38);
    const output = parsed.fromBuffer(buf);
    expect(output).toMatchObject(obj);
  });
});
