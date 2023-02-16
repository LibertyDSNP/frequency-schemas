export default {
  type: "record",
  name: "PublicKey",
  namespace: "org.dsnp",
  fields: [
    // When converting from Frequency Data to DSNP Announcement, assume:
    // - announcementType = 7
    // - fromId = [Associated MSA Id]
    {
      name: "keyType",
      type: {
        name: "KeyTypeEnum",
        type: "enum",
        symbols: ["keyAgreement"], // Encoded as int, but this limits the enum to this one value... which is basically nothing.
        // Enum could instead be at the protocol level?
      },
    },
    {
      name: "publicKey",
      type: "string", // OR "bytes" bytes would break the multikey?
    },
    {
      name: "revokedAsOf",
      type: "long",
    },
  ],
};
