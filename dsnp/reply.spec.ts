import { testCompression, testParquetSchema } from "../helpers/parquet";
import * as generators from "@dsnp/test-generators";
import replySchema from "./reply";

describe("Reply Spec", () => {
  testParquetSchema(replySchema);

  testCompression("reply", replySchema, () => ({
    announcementType: 3,
    contentHash: generators.generateHash(),
    fromId: generators.randInt(10000000),
    inReplyTo: `dsnp://${generators.randInt(10000000)}/${generators.generateHash()}`,
    url: `https://www.imadapp.com/data/posts/${generators.generateHash()}`,
  }));
});
