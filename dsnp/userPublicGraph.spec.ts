import publicGraphSchema from "./userPublicGraph";
import avro from "avro-js";

describe("Public Graph Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(publicGraphSchema);
    expect(parsed).toBeDefined();
  });

  it("can work with the inside type", () => {
    // Parse the inside and outside types.
    // The inside type must be self contained.
    const outsideType = avro.parse(publicGraphSchema);
    const insideType = avro.parse(publicGraphSchema.types[0]);

    // Generate a random inside type
    const inside = insideType.random();
    const insideBuffer = insideType.toBuffer(inside);

    // Generate the outside and buffer
    const outsideBuffer = outsideType.toBuffer({
      compressedPublicGraph: insideBuffer,
    });

    // Start from just the outsideBuffer and type
    const outsideParsed = outsideType.fromBuffer(outsideBuffer);
    const insideParsed = insideType.fromBuffer(outsideParsed.compressedPublicGraph);

    // Check the inside parsed data is the same as the original.
    expect(insideParsed).toEqual(inside);
  });
});
