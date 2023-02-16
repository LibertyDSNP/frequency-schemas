// Paginated Chunk with PRIds
export default {
  type: "record",
  name: "UserPrivateGraphChunk",
  namespace: "org.dsnp",
  fields: [
    {
      name: "pridList",
      type: "array",
      items: {
        "type": "fixed",
        "size": 16, // or 8...
        "doc": "Pseudonymous Relationship Identifier"
      },
    },
    {
      name: "ephemeralPublicKey+nonce+cyphertext",
      type: "bytes",
    },
    {
      name: "dsnpVersion",
      type: "int",
    },
  ],
};

// Unlikely to use the below ones.

const pridsAsItemized = {
  namespace: "org.dsnp",
  name: "PrivateGraphEdge",
  type: "record",
  doc: "A private relationship proof to another DSNP user",
  fields: [
      {
          name: "pridList",
          type: "array",
          items: {
            "type": "fixed",
            "size": 16, // or 8...
            "doc": "Pseudonymous Relationship Identifier"
          },
          doc: "PRId List"
      },
  ]
};

// Deserialize after combining chunks
// Doesn't really work because of the pages needing encryption
const chunkWithoutPridsAllPages = {
  type: "record",
  name: "UserPrivateGraphChunk",
  fields: [
    {
      name: "",
      type: "bytes",
    },
    { // Can we remove this or replace with a version number?
      name: "compressionAlgo",
      type: "string",
    },
  ],
};
