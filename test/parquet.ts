/* eslint-disable jest/no-export */
import fs from "fs";
import { ParquetWriter } from "@dsnp/parquetjs";
import { FrequencyParquetSchema } from "../types/frequency";
import { fromFrequencySchema } from "../parquet";

type RowGenerator = () => Record<string, unknown>;

export const testParquetSchema = async (model: FrequencyParquetSchema) => {
  test("can build a parquet file", async () => {
    expect(async () => {
      const [schema, options] = fromFrequencySchema(model);
      await ParquetWriter.openStream(
        schema,
        {
          write: jest.fn(),
          end: jest.fn(),
        },
        options
      );
    }).not.toThrow();
  });
};

export const testCompression = async (name: string, model: FrequencyParquetSchema, rowGenerator: RowGenerator) => {
  test("Compressing all columns is best", async () => {
    const defaultSize = await generateParquetTestFileSize(name, model, 100, rowGenerator);

    for (const idx in model) {
      const testSchema = [...model];
      testSchema[idx].compression = "UNCOMPRESSED";
      const uncompressedSize = await generateParquetTestFileSize(name, testSchema, 100, rowGenerator);
      expect(defaultSize).toBeLessThan(uncompressedSize);
    }
  });
};

const generateParquetTestFileSize = async (
  name: string,
  rawSchema: FrequencyParquetSchema,
  count: number,
  rowGenerator: RowGenerator
): Promise<number> => {
  const [schema, options] = fromFrequencySchema(rawSchema);
  const path = `./test-${name}-size.parquet`;
  const writer = await ParquetWriter.openFile(schema, path, options);

  for (let i = 0; i < count; i++) {
    await writer.appendRow(rowGenerator());
  }
  await writer.close();
  const size = fs.statSync(path).size;
  fs.rmSync(path);
  return size;
};
