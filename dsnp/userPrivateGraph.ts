// Paginated Chunk with PRIds
export default {
  type: "record",
  name: "UserPrivateGraphChunk",
  namespace: "org.dsnp",
  fields: [
    {
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
            doc: "Time when this relationship was originally established", // unix epoch rounded to the nearest 1000?
          },
        ],
      },
    },
  ],
};
