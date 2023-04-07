export default {
  type: "record",
  name: "PublicKey",
  namespace: "org.dsnp",
  fields: [
    // When converting from Frequency Data to DSNP Announcement, assume:
    // - announcementType = 7
    // - fromId = [Associated MSA Id]
    // - keyType = 1 for this SchemaId
    // DID Key Id could be publicKey or could be the index of the array. Not user assigned
    {
      name: "publicKey",
      doc: "Multicodec public key",
      type: "bytes",
    },
    {
      name: "keyId",
      type: "long",
      doc: "User-Assigned Key Identifier",
    },
  ],
};
