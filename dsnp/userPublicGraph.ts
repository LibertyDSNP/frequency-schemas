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
    // This is the inside type of the decompressed data
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
            doc: "Unix epoch in seconds when this relationship was originally established rounded to the nearest 1000",
          },
        ],
      },
    },
  ],
};
