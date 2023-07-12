import { ParquetSchema } from "@dsnp/parquetjs";
import type { ParquetType, FieldDefinition, SchemaDefinition, WriterOptions } from "@dsnp/parquetjs/dist/lib/declare";
import type { createSBBFParams } from "@dsnp/parquetjs/dist/lib/bloomFilterIO/bloomFilterWriter";
import { FrequencyParquetSchema, FrequencyParquetType, ParquetColumn } from "./types/frequency.js";
import * as dsnp from "./dsnp/index.js";

/**
 * All supported types from Parquetjs
 */
const supportedTypes = new Set([
  "BOOLEAN",
  "INT32",
  "INT64",
  "INT96",
  "FLOAT",
  "DOUBLE",
  "BYTE_ARRAY",
  "FIXED_LEN_BYTE_ARRAY",
  "UTF8",
  "MAP",
  "LIST",
  "ENUM",
  "DECIMAL",
  "DATE",
  "TIME_MILLIS",
  "TIME_MICROS",
  "TIMESTAMP_MILLIS",
  "TIMESTAMP_MICROS",
  "UINT_8",
  "UINT_16",
  "UINT_32",
  "UINT_64",
  "INT_8",
  "INT_16",
  "INT_32",
  "INT_64",
  "JSON",
  "BSON",
  "INTERVAL",
]);

/**
 * Simple check to make sure that type is supported.
 */
const isColumnTypeSupported = (incoming: string): incoming is ParquetType => {
  return supportedTypes.has(incoming);
};

/**
 * Error to capture all the unsupported edge cases
 */
export class UnsupportedFrequencySchemaError extends Error {
  constructor(msg: string) {
    const message = `Unsupported Frequency schema: ${msg}`;
    super(message);
    this.name = "UnsupportedFrequencySchemaError";
  }
}

const convertColumnType = (columnType: FrequencyParquetType): FieldDefinition["type"] => {
  if (typeof columnType === "string") {
    if (columnType === "STRING") return "UTF8";
    if (isColumnTypeSupported(columnType)) return columnType;
    throw new UnsupportedFrequencySchemaError(columnType.toString());
  }
  // ParquetJs uses the old format still, so not all options are available
  if ("INTEGER" in columnType) {
    return `${columnType.INTEGER.sign ? "" : "U"}INT_${columnType.INTEGER.bit_width}` as ParquetType;
  }
  if ("TIMESTAMP" in columnType && columnType.TIMESTAMP.is_adjusted_to_utc && columnType.TIMESTAMP.unit !== "NANOS") {
    return `TIMESTAMP_${columnType.TIMESTAMP.unit}` as ParquetType;
  }
  if ("TIME" in columnType && columnType.TIME.is_adjusted_to_utc && columnType.TIME.unit !== "NANOS") {
    return `TIME_${columnType.TIME.unit}` as ParquetType;
  }

  throw new UnsupportedFrequencySchemaError(columnType.toString());
};

/**
 * Converts a field from a JSON Schema into a Parquet Field Definition
 */
const fromColumn = (column: ParquetColumn): FieldDefinition => {
  return {
    type: convertColumnType(column.column_type),
    compression: column.compression,
    statistics: false,
  };
};

/**
 * Converts supported Json Schemas into Parquet Schema Definitions
 */
const toSchema = (frequencySchema: FrequencyParquetSchema): SchemaDefinition => {
  const schema: SchemaDefinition = {};

  for (const column of frequencySchema) {
    schema[column.name] = fromColumn(column);
  }

  return schema;
};

/**
 * Create a new schema from a Frequency Parquet Schema (frequency.xyz)
 * Also provides the Writer Options as Frequency Schemas support bloom filter selection.
 */
export const fromFrequencySchema = (
  frequencySchema: FrequencyParquetSchema | dsnp.ParquetSchemaName
): [ParquetSchema, WriterOptions] => {
  if (typeof frequencySchema === "string") {
    const deploy = dsnp.getSchema(frequencySchema);
    if (!deploy || deploy.modelType !== "Parquet") throw new Error("Unknown schema");
    frequencySchema = deploy.model;
  }
  const schema: SchemaDefinition = toSchema(frequencySchema);
  const bloomFilters = frequencySchema.reduce<createSBBFParams[]>((acc, x) => {
    if (x.bloom_filter) acc.push({ column: x.name });
    return acc;
  }, []);
  return [
    new ParquetSchema(schema),
    {
      bloomFilters,
    },
  ];
};
