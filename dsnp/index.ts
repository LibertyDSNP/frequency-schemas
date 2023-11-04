import { FrequencyParquetSchema } from "../types/frequency.js";

import broadcast from "./broadcast.js";
// Deprecated
// import graphChange from "./dsnp/graphChange.js";
import profile from "./profile.js";
import reaction from "./reaction.js";
import reply from "./reply.js";
import tombstone from "./tombstone.js";
import publicKey from "./publicKey.js";
import userPublicFollows from "./userPublicFollows.js";
import userPrivateFollows from "./userPrivateFollows.js";
import userPrivateConnections from "./userPrivateConnections.js";
import update from "./update.js";

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
export type AvroSchemaName =
  | "publicKey_keyAgreement"
  | "publicKey_assertionMethod"
  | "userPublicFollows"
  | "userPrivateFollows"
  | "userPrivateConnections";

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
    "publicKey_keyAgreement",
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
  [
    "publicKey_assertionMethod",
    {
      model: publicKey,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["AppendOnly", "SignatureRequired"],
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
