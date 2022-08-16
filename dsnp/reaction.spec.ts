import { testCompression, testParquetSchema } from "../helpers/parquet";
import * as generators from "@dsnp/test-generators";
import reactionSchema from "./reaction";

describe("Reaction Spec", () => {
  testParquetSchema(reactionSchema);

  testCompression("reaction", reactionSchema, () => ({
    announcementType: 4,
    emoji: generators.sample(["😀", "🤌🏼", "👩🏻‍🎤", "🧑🏿‍🏫", "🏳️‍🌈", "🏳️‍⚧️", "⚛︎", "🃑", "♻︎"]),
    apply: generators.randInt(255),
    fromId: generators.randInt(10000000),
    inReplyTo: `dsnp://${generators.randInt(10000000)}/${generators.generateHash()}`,
  }));
});
