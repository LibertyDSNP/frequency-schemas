import { testCompression, testParquetSchema } from "../helpers/parquet";
import * as generators from "@dsnp/test-generators";
import tombstoneSchema from "./tombstone";

describe("Tombstone Spec", () => {
  testParquetSchema(tombstoneSchema);

  testCompression("tombstone", tombstoneSchema, () => ({
    announcementType: 0,
    fromId: generators.randInt(10000000),
    targetAnnouncementType: 2,
    targetContentHash: generators.generateHash(),
  }));
});
