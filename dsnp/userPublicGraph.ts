// Paginated Chunk of compressed data with a type defined for the data post decompression
export default {
  type: "record",
  name: "UserPublicGraphChunk",
  namespace: "org.dsnp",
  fields: [
    {
      name: "compressedPublicGraph",
      type: "bytes",
    },
  ],
  types: [
    {
      type: "array",
      name: "PublicGraph",
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
