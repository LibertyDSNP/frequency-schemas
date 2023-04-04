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

export type Deploy = {
  model: ParquetModel | object;
  modelType: ModelType;
  payloadLocation: PayloadLocation;
};

// Map schema names (string) to deploy object
export const dsnpSchemas = new Map<string, Deploy>([
  [
    "broadcast",
    {
      model: broadcast,
      modelType: "Parquet",
      payloadLocation: "IPFS",
    },
  ],
  [
    "profile",
    {
      model: profile,
      modelType: "Parquet",
      payloadLocation: "IPFS",
    },
  ],
  [
    "reaction",
    {
      model: reaction,
      modelType: "Parquet",
      payloadLocation: "IPFS",
    },
  ],
  [
    "reply",
    {
      model: reply,
      modelType: "Parquet",
      payloadLocation: "IPFS",
    },
  ],
  [
    "tombstone",
    {
      model: tombstone,
      modelType: "Parquet",
      payloadLocation: "IPFS",
    },
  ],
  [
    "update",
    {
      model: update,
      modelType: "Parquet",
      payloadLocation: "IPFS",
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
    },
  ],
  [
    "userPublicFollows",
    {
      model: userPublicFollows,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
    },
  ],
  [
    "userPrivateFollows",
    {
      model: userPrivateFollows,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
    },
  ],
  [
    "userPrivateConnections",
    {
      model: userPrivateConnections,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
    },
  ],
]);

export const getSchema = (name: string): Deploy | null => {
  return dsnpSchemas.get(name) || null;
};
