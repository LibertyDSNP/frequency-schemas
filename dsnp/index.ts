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
import { ParquetModel } from "../types/frequency";
import update from "./update";

type PayloadLocation = "IPFS" | "OnChain" | "Itemized" | "Paginated";
type ModelType = "AvroBinary" | "Parquet";

type Settings = "AppendOnly" | "SignatureRequired";

export type Deploy = {
  model: ParquetModel | object;
  modelType: ModelType;
  payloadLocation: PayloadLocation;
  settings: Settings[];
};

// Map schema names (string) to deploy object
export const dsnpSchemas = new Map<string, Deploy>([
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
    "profile",
    {
      model: profile,
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
    "reply",
    {
      model: reply,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],
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
    "update",
    {
      model: update,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
    },
  ],
  // Deprecated
  // ["graphChange", {
  //   model: graphChange,
  //   modelType: "Parquet",
  //   payloadLocation: "IPFS"
  // }],
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

export const getSchema = (name: string): Deploy | null => {
  return dsnpSchemas.get(name) || null;
};
