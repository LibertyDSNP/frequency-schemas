import { ApiPromise } from "@polkadot/api";

import type { Schema } from "avsc";
import { DSNPParquetSchema } from "@dsnp/schemas/types/dsnp-parquet.js";
import {
  AnnouncementType,
  descriptorForAnnouncementType,
  UserDataType,
  descriptorForUserDataType,
} from "@dsnp/schemas";

import userPublicFollows from "./userPublicFollows.js";
import userPrivateFollows from "./userPrivateFollows.js";
import userPrivateConnections from "./userPrivateConnections.js";

const broadcast = descriptorForAnnouncementType(AnnouncementType.Broadcast).parquetSchema;
const reaction = descriptorForAnnouncementType(AnnouncementType.Reaction).parquetSchema;
const reply = descriptorForAnnouncementType(AnnouncementType.Reply).parquetSchema;
const tombstone = descriptorForAnnouncementType(AnnouncementType.Tombstone).parquetSchema;
const update = descriptorForAnnouncementType(AnnouncementType.Update).parquetSchema;
const userAttributeSet = descriptorForAnnouncementType(AnnouncementType.UserAttributeSet).parquetSchema;
const dsnpContentAttributeSet = descriptorForAnnouncementType(AnnouncementType.DSNPContentAttributeSet).parquetSchema;
const externalContentAttributeSet = descriptorForAnnouncementType(
  AnnouncementType.ExternalContentAttributeSet,
).parquetSchema;

const profile = descriptorForUserDataType(UserDataType.ProfileResources).avroSchema;
const publicKey = descriptorForUserDataType(UserDataType.KeyAgreementPublicKeys).avroSchema;

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

/*
 * DSNP versions are different from named schema versions on
 * Frequency. They refer to the first version of the DSNP
 * specification where the relevant form of the data type is
 * defined. It may be necessary for future applications to support
 * "schema evolution" of DSNP data types by processing both old and
 * new Frequency Schema Ids.
 *
 * Only those DSNP versions that define types with corresponding data
 * on mainnet are noted here.
 */
export type DSNPVersion = "1.1" | "1.2" | "1.3";

type ParquetDeploy = {
  model: DSNPParquetSchema;
  modelType: "Parquet";
  payloadLocation: "IPFS";
  settings: [];
  dsnpVersion: DSNPVersion;
};

type AvroDeploy = {
  model: Schema;
  modelType: "AvroBinary";
  payloadLocation: PayloadLocation;
  settings: Settings[];
  dsnpVersion: DSNPVersion;
};

export type Deploy = ParquetDeploy | AvroDeploy;

export type ParquetSchemaName =
  | "broadcast"
  | "reaction"
  | "reply"
  | "tombstone"
  | "update"
  | "user-attribute-set"
  | "dsnp-content-attribute-set"
  | "ext-content-attribute-set";
export type AvroSchemaName =
  | "public-key-key-agreement"
  | "public-key-assertion-method"
  | "public-follows"
  | "private-follows"
  | "private-connections"
  | "profile-resources";

export type SchemaName = ParquetSchemaName | AvroSchemaName;

// Map schema names (string) to deploy object
// Note: This structure only facilitates deploying current version of each named schema;
//   if we want to deploy multiple versions, we need to move dsnpVersion into the key.
export const schemas = new Map<SchemaName, Deploy>([
  [
    "tombstone",
    {
      model: tombstone,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
  [
    "broadcast",
    {
      model: broadcast,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
  [
    "reply",
    {
      model: reply,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
  [
    "reaction",
    {
      model: reaction,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.1",
    },
  ],
  [
    "update",
    {
      model: update,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
  [
    "public-key-key-agreement",
    {
      model: publicKey,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["AppendOnly", "SignatureRequired"],
      dsnpVersion: "1.2",
    },
  ],
  [
    "public-follows",
    {
      model: userPublicFollows,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
      dsnpVersion: "1.2",
    },
  ],
  [
    "private-follows",
    {
      model: userPrivateFollows,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
      dsnpVersion: "1.2",
    },
  ],
  [
    "private-connections",
    {
      model: userPrivateConnections,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
      dsnpVersion: "1.2",
    },
  ],
  [
    "public-key-assertion-method",
    {
      model: publicKey,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["SignatureRequired"],
      dsnpVersion: "1.3",
    },
  ],
  [
    "profile-resources",
    {
      model: profile,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
  [
    "user-attribute-set",
    {
      model: userAttributeSet,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
  [
    "dsnp-content-attribute-set",
    {
      model: dsnpContentAttributeSet,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
  [
    "ext-content-attribute-set",
    {
      model: externalContentAttributeSet,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.3",
    },
  ],
]);

export const getSchema = (name: SchemaName): Deploy | null => {
  return schemas.get(name) || null;
};

// genesisHash --> DSNP spec name for announcement or user data type --> DSNP version --> Frequency schemaId
export type SchemaMapping = { [schemaName: string]: { [version: string]: number } };
const chainMapping: { [genesisHash: string]: SchemaMapping } = {};

export const GENESIS_HASH_TESTNET_PASEO = "0x203c6838fc78ea3660a2f298a58d859519c72a5efdc0f194abd6f0d5ce1838e0";
export const GENESIS_HASH_MAINNET = "0x4a587bf17a404e3572747add7aab7bbe56e805a5479c6c436f07f36fcc8d3ae1";

/*
 * As schemas are approved on mainnet they will be added to the Frequency source code in
 * https://github.com/frequency-chain/frequency/blob/main/resources/genesis-schemas.json
 * and also backported so that testnet contains all approved schemas.
 */
chainMapping[GENESIS_HASH_MAINNET] = {
  tombstone: { "1.2": 1, "1.3": 16 },
  broadcast: { "1.2": 2, "1.3": 17 },
  reply: { "1.2": 3, "1.3": 18 },
  reaction: { "1.1": 4 },
  update: { "1.2": 5, "1.3": 19 },
  "public-key-key-agreement": { "1.2": 7 },
  "public-follows": { "1.2": 8 },
  "private-follows": { "1.2": 9 },
  "private-connections": { "1.2": 10 },
  "user-attribute-set": { "1.3": 20 },
  "dsnp-content-attribute-set": { "1.3": 12 },
  "ext-content-attribute-set": { "1.3": 13 },
  "public-key-assertion-method": { "1.3": 14 },
  "profile-resources": { "1.3": 15 },
};

// Schemas that exist on testnet but not yet on mainnet should be appended here
chainMapping[GENESIS_HASH_TESTNET_PASEO] = {
  ...chainMapping[GENESIS_HASH_MAINNET],
};

// Schemas that exist only on a local/development chain should be appended here
chainMapping["default"] = {
  ...chainMapping[GENESIS_HASH_MAINNET],
};

/**
 * Gets the schemaId from the Frequency instance configured for
 * apiPromise for the given DSNP type and version. If version is
 * unspecified, the latest version is returned. (You probably only
 * need version if you're migrating.)
 */
export const getSchemaId = async (
  apiPromise: Promise<ApiPromise>,
  schemaName: SchemaName,
  dsnpVersion?: DSNPVersion,
): Promise<number> => {
  const api = await apiPromise;
  const genesisHash = api.genesisHash.toString();
  let mapping = chainMapping[genesisHash];
  // If we don't recognize this chain, use default mapping
  if (!mapping) mapping = chainMapping["default"];
  const versions = mapping[schemaName];
  if (!versions) throw new Error("No mapping for schema named " + schemaName);

  let schemaId: number | undefined = undefined;
  if (dsnpVersion) {
    schemaId = versions[dsnpVersion];
  } else {
    // This could be made smarter/more efficient, but works for now to get the latest
    schemaId = versions["1.3"] || versions["1.2"] || versions["1.1"] || undefined;
  }
  if (!schemaId) throw new Error("Could not find matching schema version");
  return schemaId;
};

// Sets mapping for an additional chain instance (e.g. a local one)
export const setSchemaMapping = (genesisHash: string, schemaMapping: SchemaMapping) => {
  const mapping = chainMapping[genesisHash];
  if (mapping) throw new Error("Mapping already registered for chain with genesis hash " + genesisHash);
  chainMapping[genesisHash] = schemaMapping;
};

export default {
  schemas,
  getSchema,
  getSchemaId,
  setSchemaMapping,
};
