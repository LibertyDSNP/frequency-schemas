export default {
  type: "record",
  name: "GraphChange",
  fields: [
    {
      // Do we need this?
      name: "announcementType",
      type: {
        name: "AnnouncementTypeEnum",
        type: "fixed",
        size: 1,
      },
      // symbols: ["1"], // No way to force this without being a string
    },
    {
      name: "changeType",
      type: {
        name: "ChangeTypeEnum",
        type: "enum",
        symbols: ["Unfollow", "Follow"], // Encoded as int
      },
    },
    {
      name: "fromId",
      type: {
        name: "DSNPId",
        type: "fixed",
        size: 8,
      },
    },
    {
      name: "objectId",
      type: "DSNPId",
    },
  ],
};
