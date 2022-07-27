import { ParquetWriter } from "@dsnp/parquetjs";
import { transformToParquetjs } from "../helpers/parquet";
import broadcastSchema from "./broadcast";

describe("Broadcast Spec", () => {
  it("can build a parquet file", async () => {
    await expect(async () => {
      const [schema, bloom] = transformToParquetjs(broadcastSchema);
      await ParquetWriter.openStream(
        schema,
        {
          write: jest.fn(),
          end: jest.fn(),
        },
        { bloomFilters: bloom }
      );
    }).not.toThrow();
  });
});
