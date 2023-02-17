// Paginated Chunk of compressed data with a type defined for the internal Data
export default {
  type: "record",
  name: "UserPublicGraphChunk",
  namespace: "org.dsnp",
  fields: [
    {
      name: "compressedPublicGraph",
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
      name: "PublicGraph",
      type: "array",
      items: "GraphEdge",
    },
  ],
};
