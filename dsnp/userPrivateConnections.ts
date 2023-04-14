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
        items: {
          name: "prid",
          type: "fixed",
          size: 8,
          doc: "Pseudonymous Relationship Identifier",
        },
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
      items: {
        type: "record",
        name: "GraphEdge",
        fields: [
          {
            name: "userId",
            type: "long",
            doc: "DSNP User Id of object of relationship",
          },
          {
            name: "since",
            type: "long",
            doc: "Unix epoch in seconds when this relationship was originally established rounded to the nearest 1000",
          },
        ],
      },
    },
  ],
};
