import { testCompression, testParquetSchema } from "../helpers/parquet";
import * as generators from "@dsnp/test-generators";
import broadcastSchema from "./broadcast";

describe("Broadcast Spec", () => {
  testParquetSchema(broadcastSchema);

  testCompression("broadcast", broadcastSchema, () => ({
    announcementType: 2,
    contentHash: generators.generateHash(),
    fromId: generators.randInt(10000000),
    url: `https://www.imadapp.com/data/posts/${generators.generateHash()}`,
  }));
});
