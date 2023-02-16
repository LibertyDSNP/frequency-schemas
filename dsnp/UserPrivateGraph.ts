// Paginated Chunk with PRIds
// https://github.com/Liberty30/admin/wiki/Simple-Encryption-Formats
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
    // Should we put the encryption into a standard box like SEF?
    {
      name: "cyphertext",
      type: "bytes", // base64url string?
    },
    {
      name: "nonce",
      type: "bytes", // base64url string?
    },
    {
      name: "ephemeralPublicKey",
      type: "bytes", // base64url string?
    },
    { // Do we need this?
      name: "algorithm",
      type: "string", // enum?
    },
    { // Can we remove this or replace with a version number?
      name: "compressionAlgorithm",
      type: "string",
    },
  ],
};

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
