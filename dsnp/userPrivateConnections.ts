import { UserDataType, descriptorForUserDataType } from "@dsnp/schemas";

// Paginated Chunk with PRIds
export default {
  type: "record",
  name: "UserPrivateConnectionsChunk",
  namespace: "org.dsnp",
  fields: [
    {
      name: "keyId",
      type: "long",
      doc: "User-Assigned Key Identifier",
    },
    {
      // The PRId List should be ordered the same as the GraphEdges
      name: "pridList",
      type: {
        type: "array",
        items: descriptorForUserDataType(UserDataType.PrivateConnectionPRIds).avroSchema,
      },
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
      items: descriptorForUserDataType(UserDataType.PrivateConnections).avroSchema,
    },
  ],
};
