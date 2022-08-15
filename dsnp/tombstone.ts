import { ParquetModel } from "../types/frequency";

const tombstone: ParquetModel = [
  {
    name: "announcementType",
    column_type: {
      INTEGER: {
        bit_width: 16,
        sign: false,
      },
    },
    compression: "GZIP",
    bloom_filter: false,
  },
  {
    name: "fromId",
    column_type: {
      INTEGER: {
        bit_width: 64,
        sign: false,
      },
    },
    compression: "GZIP",
    bloom_filter: true,
  },
  {
    name: "targetAnnouncementType",
    column_type: {
      INTEGER: {
        bit_width: 16,
        sign: false,
      },
    },
    compression: "GZIP",
    bloom_filter: false,
  },
  {
    name: "targetContentHash",
    column_type: "BYTE_ARRAY",
    compression: "GZIP",
    bloom_filter: true,
  },
];

export default tombstone;
