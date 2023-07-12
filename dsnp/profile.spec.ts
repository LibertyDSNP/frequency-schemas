import { testCompression, testParquetSchema } from "../test/parquet.js";
import * as generators from "@dsnp/test-generators";
import profileSchema from "./profile.js";

describe("Profile Spec", () => {
  testParquetSchema(profileSchema);

  testCompression("profile", profileSchema, () => ({
    announcementType: 5,
    contentHash: generators.generateHash(),
    fromId: generators.randInt(10000000),
    url: `https://www.imadapp.com/data/posts/${generators.generateHash()}`,
  }));
});
