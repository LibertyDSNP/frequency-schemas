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
          size: 16, // or 8...
          doc: "Pseudonymous Relationship Identifier",
        },
      },
    },
    {
      doc: "lib_sodium sealed box",
      name: "encryptedCompressedPrivateGraph",
      type: "bytes",
    },
    {
      name: "dsnpVersion",
      type: "int",
    },
  ],
  types: [
    {
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
    {
      name: "PrivateGraph",
      type: "array",
      items: "GraphEdge",
    },
  ],
};
