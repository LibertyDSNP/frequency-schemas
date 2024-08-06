import { ApiPromise } from "@polkadot/api";

import { Schema } from "avsc";
import { DSNPParquetSchema } from "@dsnp/schemas/types/dsnp-parquet.js";
import { AnnouncementType, descriptorForAnnouncementType, UserDataType, descriptorForUserDataType } from "@dsnp/schemas";

import userPublicFollows from "./userPublicFollows.js";
import userPrivateFollows from "./userPrivateFollows.js";
import userPrivateConnections from "./userPrivateConnections.js";

const broadcast = descriptorForAnnouncementType(AnnouncementType.Broadcast).parquetSchema;
const reaction = descriptorForAnnouncementType(AnnouncementType.Reaction).parquetSchema;
const reply = descriptorForAnnouncementType(AnnouncementType.Reply).parquetSchema;
const tombstone = descriptorForAnnouncementType(AnnouncementType.Tombstone).parquetSchema;
const update = descriptorForAnnouncementType(AnnouncementType.Update).parquetSchema;

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

export type ParquetSchemaName = "broadcast" | "reaction" | "reply" | "tombstone" | "update";
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
      dsnpVersion: "1.2",
    },
  ],
  [
    "broadcast",
    {
      model: broadcast,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.2",
    },
  ],
  [
    "reply",
    {
      model: reply,
      modelType: "Parquet",
      payloadLocation: "IPFS",
      settings: [],
      dsnpVersion: "1.2",
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
      dsnpVersion: "1.2",
    },
  ],
  [
    "public-key-key-agreement",
    {
      model: publicKey as Schema,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["AppendOnly", "SignatureRequired"],
      dsnpVersion: "1.2",
    },
  ],
  [
    "public-follows",
    {
      model: userPublicFollows as Schema,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
      dsnpVersion: "1.2",
    },
  ],
  [
    "private-follows",
    {
      model: userPrivateFollows as Schema,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
      dsnpVersion: "1.2",
    },
  ],
  [
    "private-connections",
    {
      model: userPrivateConnections as Schema,
      modelType: "AvroBinary",
      payloadLocation: "Paginated",
      settings: [],
      dsnpVersion: "1.2",
    },
  ],
  [
    "public-key-assertion-method",
    {
      model: publicKey as Schema,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["AppendOnly", "SignatureRequired"],
      dsnpVersion: "1.3",
    },
  ],
  [
    "profile-resources",
    {
      model: profile as Schema,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
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

chainMapping[GENESIS_HASH_TESTNET_PASEO] = {
  tombstone: { "1.2": 1 },
  broadcast: { "1.2": 2 },
  reply: { "1.2": 3 },
  reaction: { "1.1": 4 },
  update: { "1.2": 5 },
  "public-key-key-agreement": { "1.2": 7 },
  "public-follows": { "1.2": 8 },
  "private-follows": { "1.2": 9 },
  "private-connections": { "1.2": 10 },
  "public-key-assertion-method": { "1.3": 11 },
//  "profile-resources": { "1.3": TBD },
};
chainMapping[GENESIS_HASH_MAINNET] = {
  tombstone: { "1.2": 1 },
  broadcast: { "1.2": 2 },
  reply: { "1.2": 3 },
  reaction: { "1.1": 4 },
  profile: { "1.2": 6 },
  update: { "1.2": 5 },
  "public-key-key-agreement": { "1.2": 7 },
  "public-follows": { "1.2": 8 },
  "private-follows": { "1.2": 9 },
  "private-connections": { "1.2": 10 },
//  "public-key-assertion-method": { "1.3": TBD },
//  "profile-resources": { "1.3": TBD },
};
/*
 * Schema in "default" deployments (e.g. to a clean local chain) are
 * numbered according to the `schemas` array (beginning with 1).  If
 * you have a non-standard deployment, call `setSchemaMapping()`
 * manually.
 */
chainMapping["default"] = {
  tombstone: { "1.2": 1 },
  broadcast: { "1.2": 2 },
  reply: { "1.2": 3 },
  reaction: { "1.1": 4 },
  profile: { "1.2": 5 },
  update: { "1.2": 6 },
  "public-key-key-agreement": { "1.2": 7 },
  "public-follows": { "1.2": 8 },
  "private-follows": { "1.2": 9 },
  "private-connections": { "1.2": 10 },
  "public-key-assertion-method": { "1.3": 11 },
  "profile-resources": { "1.3": 12 },
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
