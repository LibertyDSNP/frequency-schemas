import { UserDataType, descriptorForUserDataType } from "@dsnp/schemas";

// Paginated Chunk of compressed data with a type defined for the data post decompression
export default {
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
