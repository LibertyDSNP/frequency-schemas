export default {
  namespace: "org.dsnp.userdata",
  name: "GraphEdge",
  type: "record",
  doc: "A relationship to another DSNP user",
  fields: [
      {
          name: "userId",
          type: "long",
          doc: "DSNP User Id of object of relationship"
      },
      {
          name: "since",
          type: "long",
          doc: "Time when this relationship was originally established" // unix epoch rounded to the nearest 1000?
      }
  ]
};