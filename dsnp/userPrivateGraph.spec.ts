import privateGraphSchema from "./userPrivateGraph";
import avro from "avro-js";

describe("Private Graph Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(privateGraphSchema);
    expect(parsed).toBeDefined();
  });

  it("can work with the inside type", () => {
    // Parse the inside and outside types.
    // The inside type must be self contained.
    const outsideType = avro.parse(privateGraphSchema);
    const insideType = avro.parse(privateGraphSchema.types[0]);

    // Generate a random inside type
    const inside = insideType.random();
    const insideBuffer = insideType.toBuffer(inside);

    const pridType = avro.parse({
      name: "prid",
      type: "fixed",
      size: 8,
    });

    const pridList = [pridType.random(), pridType.random()];

    const keyIdType = avro.parse({
      name: "identifier",
      type: "long",
    });

    const lastUpdatedType = avro.parse({
      name: "lastUpdated",
      type: "long",
    });

    const lastUpdated = lastUpdatedType.random();

    // Generate the outside and buffer
    const outsideBuffer = outsideType.toBuffer({
      keyId: keyIdType.random(),
      pridList,
      lastUpdated,
      encryptedCompressedPrivateGraph: insideBuffer,
    });

    // Start from just the outsideBuffer and type
    const outsideParsed = outsideType.fromBuffer(outsideBuffer);
    const insideParsed = insideType.fromBuffer(outsideParsed.encryptedCompressedPrivateGraph);

    // Check the inside parsed data is the same as the original.
    expect(insideParsed).toEqual(inside);

    // check lastUpdated
    expect(outsideParsed.lastUpdated).toEqual(lastUpdated);

    // Also check the pridList, but that is just testing Avro
    expect(outsideParsed.pridList).toEqual(pridList);
  });
});
