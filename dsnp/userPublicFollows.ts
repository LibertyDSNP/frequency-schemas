import { UserDataType, descriptorForUserDataType } from "@dsnp/schemas";
import type { Schema } from "avsc";

// Paginated Chunk of compressed data with a type defined for the data post decompression
const schema: Schema = {
  type: "record",
  name: "UserPublicFollowsChunk",
  namespace: "org.dsnp",
  fields: [
    {
      name: "compressedPublicGraph",
      type: "bytes",
    },
  ],
  types: [
    // This is the inside type of the decompressed data
    {
      type: "array",
      name: "PublicGraph",
      namespace: "org.dsnp",
      items: descriptorForUserDataType(UserDataType.PublicFollows).avroSchema,
    },
  ],
};

export default schema;
