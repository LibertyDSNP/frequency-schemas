// Last updated 2023-06-01

import { ParquetCompression } from "@dsnp/parquetjs/dist/lib/declare";

export type FrequencyParquetSchema = Array<ParquetColumn>;

export type FrequencyParquetType = ParquetBaseType | ParquetStringType | ParquetNumericType | ParquetTemporalType;

export interface ParquetColumn {
  name: string;
  column_type: FrequencyParquetType;
  compression: ColumnCompressionCodec;
  bloom_filter: boolean;
}

type ColumnCompressionCodec = ParquetCompression;

type ParquetBaseType = "BOOLEAN" | "INT32" | "INT64" | "FLOAT" | "DOUBLE" | "BYTE_ARRAY" | "FIXED_LEN_BYTE_ARRAY";

type ParquetStringType = "STRING" | "UUID";

type ParquetNumericType = ParquetInteger | ParquetDecimal;

type ParquetInteger = {
  INTEGER: {
    bit_width: number;
    sign: boolean;
  };
};

type ParquetDecimal = {
  DECIMAL: {
    scale: number;
    precision: number;
  };
};

type ParquetTemporalType = "DATE" | "INTERVAL" | ParquetTime | ParquetTimestamp;

type ParquetTime = {
  TIME: {
    is_adjusted_to_utc: boolean;
    unit: ParquetTimeUnit;
  };
};

type ParquetTimestamp = {
  TIMESTAMP: {
    is_adjusted_to_utc: boolean;
    unit: ParquetTimeUnit;
  };
};

type ParquetTimeUnit = "MILLIS" | "MICROS" | "NANOS";
