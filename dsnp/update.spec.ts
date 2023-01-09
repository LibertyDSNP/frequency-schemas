import { testCompression, testParquetSchema } from "../helpers/parquet";
import * as generators from "@dsnp/test-generators";
import updateSchema from "./update";

describe("Update Spec", () => {
  testParquetSchema(updateSchema);

  testCompression("update", updateSchema, () => ({
    announcementType: 6,
    contentHash: generators.generateHash(),
    fromId: generators.randInt(10000000),
    targetAnnouncementType: 2,
    targetContentHash: generators.generateHash(),
    url: `https://www.imadapp.com/data/posts/${generators.generateHash()}`,
  }));
});
