/* eslint-disable jest/no-export */
import fs from "fs";
import { ParquetSchema, ParquetWriter } from "@dsnp/parquetjs";
import { FrequencyParquetType, ParquetModel } from "../types/frequency";

type BloomFilterColumn = { column: string };
type RowGenerator = () => Record<string, unknown>;

const convertColumnType = (columnType: FrequencyParquetType): string => {
  if (typeof columnType === "string") {
    switch (columnType) {
      case "STRING":
        return "UTF8";
      default:
        return columnType;
    }
  }
  if ("INTEGER" in columnType) {
    // ParquetJs uses the old format still
    return `${columnType.INTEGER.sign ? "" : "U"}INT_${columnType.INTEGER.bit_width}`;
  }
  throw new Error("Not currently supported in transformation");
};

// Transform a ParquetModel (an array of ParquetColumn) to a ParquetSchema
const transformToParquetjs = (frequencySchema: ParquetModel): [ParquetSchema, BloomFilterColumn[]] => {
  const schema = Object.fromEntries(
    frequencySchema.map((column) => {
      return [
        column.name,
        {
          type: convertColumnType(column.column_type),
          compression: column.compression,
          statistics: false,
        },
      ];
    })
  );
  const bloomFilters = frequencySchema.reduce<BloomFilterColumn[]>((acc, x) => {
    if (x.bloom_filter) acc.push({ column: x.name });
    return acc;
  }, []);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return [new ParquetSchema(schema as any), bloomFilters];
};

export const testParquetSchema = async (model: ParquetModel) => {
  test("can build a parquet file", async () => {
    await expect(async () => {
      const [schema, bloom] = transformToParquetjs(model);
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
};

export const testCompression = async (name: string, model: ParquetModel, rowGenerator: RowGenerator) => {
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
  rawSchema: ParquetModel,
  count: number,
  rowGenerator: RowGenerator
): Promise<number> => {
  const [schema, bloom] = transformToParquetjs(rawSchema);
  const path = `./test-${name}-size.parquet`;
  const writer = await ParquetWriter.openFile(schema, path, { bloomFilters: bloom });

  for (let i = 0; i < count; i++) {
    await writer.appendRow(rowGenerator());
  }
  await writer.close();
  const size = fs.statSync(path).size;
  fs.rmSync(path);
  return size;
};
