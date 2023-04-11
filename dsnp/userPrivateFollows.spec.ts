import privateFollowsSchema from "./userPrivateFollows";
import avro from "avro-js";

describe("Private Follows Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(privateFollowsSchema);
    expect(parsed).toBeDefined();
  });

  it("can work with the inside type", () => {
    // Parse the inside and outside types.
    // The inside type must be self contained.
    const outsideType = avro.parse(privateFollowsSchema);
    const insideType = avro.parse(privateFollowsSchema.types[0]);

    // Generate a random inside type
    const inside = insideType.random();
    const insideBuffer = insideType.toBuffer(inside);

    const keyIdType = avro.parse({
      name: "identifier",
      type: "long",
    });

    // Generate the outside and buffer
    const outsideBuffer = outsideType.toBuffer({
      keyId: keyIdType.random(),
      encryptedCompressedPrivateGraph: insideBuffer,
    });

    // Start from just the outsideBuffer and type
    const outsideParsed = outsideType.fromBuffer(outsideBuffer);
    const insideParsed = insideType.fromBuffer(outsideParsed.encryptedCompressedPrivateGraph);

    // Check the inside parsed data is the same as the original.
    expect(insideParsed).toEqual(inside);
  });
});
