import { UserDataType, descriptorForUserDataType } from "@dsnp/schemas";
import type { Schema } from "avsc";

// Paginated Chunks
const schema: Schema = {
  type: "record",
  name: "UserPrivateFollowsChunk",
  namespace: "org.dsnp",
  fields: [
    {
      name: "keyId",
      type: "long",
      doc: "User-Assigned Key Identifier",
    },
    {
      doc: "lib_sodium sealed box",
      name: "encryptedCompressedPrivateGraph",
      type: "bytes",
    },
  ],
  types: [
    // This is the inside type of the decrypted and decompressed data
    {
      type: "array",
      name: "PrivateGraph",
      namespace: "org.dsnp",
      items: descriptorForUserDataType(UserDataType.PrivateFollows).avroSchema,
    },
  ],
};

export default schema;
