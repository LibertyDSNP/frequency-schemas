import { FrequencyParquetSchema } from "../types/frequency";

import broadcast from "./broadcast";
// Deprecated
// import graphChange from "./dsnp/graphChange";
import profile from "./profile";
import reaction from "./reaction";
import reply from "./reply";
import tombstone from "./tombstone";
import publicKey from "./publicKey";
import userPublicFollows from "./userPublicFollows";
import userPrivateFollows from "./userPrivateFollows";
import userPrivateConnections from "./userPrivateConnections";
import update from "./update";

export {
  broadcast,
  profile,
  reaction,
  reply,
  tombstone,
  publicKey,
  userPrivateFollows,
  userPrivateConnections,
  userPublicFollows,
  update,
};

type PayloadLocation = "IPFS" | "OnChain" | "Itemized" | "Paginated";
type Settings = "AppendOnly" | "SignatureRequired";

type ParquetDeploy = {
  model: FrequencyParquetSchema;
  modelType: "Parquet";
  payloadLocation: "IPFS";
  settings: [];
};

type AvroDeploy = {
  model: object;
  modelType: "AvroBinary";
  payloadLocation: PayloadLocation;
  settings: Settings[];
};

export type Deploy = ParquetDeploy | AvroDeploy;

export type ParquetSchemaName = "broadcast" | "profile" | "reaction" | "reply" | "tombstone" | "update";
export type AvroSchemaName = "publicKey" | "userPublicFollows" | "userPrivateFollows" | "userPrivateConnections";

export type SchemaName = ParquetSchemaName | AvroSchemaName;

// Map schema names (string) to deploy object
export const schemas = new Map<SchemaName, Deploy>([
  [
    "tombstone",
    {
      model: tombstone,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],
  [
    "broadcast",
    {
      model: broadcast,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],
  [
    "reply",
    {
      model: reply,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],
  [
    "reaction",
    {
      model: reaction,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],
  [
    "profile",
    {
      model: profile,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],

  [
    "update",
    {
      model: update,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],
  [
    "publicKey",
    {
      model: publicKey,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["AppendOnly", "SignatureRequired"],
    },
  ],
  [
    "userPublicFollows",
    {
      model: userPublicFollows,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
    },
  ],
  [
    "userPrivateFollows",
    {
      model: userPrivateFollows,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
    },
  ],
  [
    "userPrivateConnections",
    {
      model: userPrivateConnections,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
    },
  ],
]);

export const getSchema = (name: SchemaName): Deploy | null => {
  return schemas.get(name) || null;
};

export default {
  schemas,
  getSchema,
};
