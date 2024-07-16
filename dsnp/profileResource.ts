export default {
  namespace: "org.dsnp",
  name: "ProfileResource",
  type: "record",
  doc: "Profile-linked resource",
  fields: [
    {
      name: "type",
      type: "int",
      doc: "Type of resource",
    },
    {
      name: "contentHash",
      type: "bytes",
      doc: "Multihash digest of resource content",
    },
    {
      name: "length",
      type: "int",
      doc: "Length of resource in bytes",
    },
  ],
};
