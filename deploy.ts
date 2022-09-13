import broadcast from "./dsnp/broadcast";
import graphChange from "./dsnp/graphChange";
import profile from "./dsnp/profile";
import reaction from "./dsnp/reaction";
import reply from "./dsnp/reply";
import tombstone from "./dsnp/tombstone";
import { ParquetModel } from "./types/frequency";
import update from "./dsnp/update";
import { requireGetProviderApi, requireGetServiceKeys } from "./services/connect";

// Map schema names (string) to schema object
const nameToSchema = new Map<string, ParquetModel | object>([
  ["broadcast", broadcast],
  ["profile", profile],
  ["reaction", reaction],
  ["reply", reply],
  ["tombstone", tombstone],
  ["update", update],
  ["graphChange", graphChange],
]);

export const deploy = async () => {
  console.log("Deploy of Schemas Starting...");

  const args = process.argv.slice(2);

  let schemas: string[];

  // Process arguments
  if (args.length == 0) {
    schemas = ["broadcast", "profile", "reaction", "reply", "tombstone", "update", "graphChange"];
  } else if (args.length == 1) {
    // Does schema with name exist?
    const schemaName = args[0];
    const sc = nameToSchema.get(schemaName);
    if (sc == undefined) {
      console.error("ERR: No specified schema with name.");
      process.exit(1);
    } else {
      schemas = [schemaName];
    }
  } else {
    console.error("ERR: You can only specify a single schema to register or all schemas if not specified.");
    process.exit(1);
  }

  await registerSchemas(schemas);
};

const registerSchemas = async (schemas: string[]) => {
  const api = await requireGetProviderApi();
  const serviceKeys = requireGetServiceKeys();

  let extrinsic;

  for (const schemaName of schemas) {
    console.log("Registering " + schemaName + " schema.");

    // Get the schema from the name
    const schema = nameToSchema.get(schemaName);
    // Create JSON from the schema object
    const json = JSON.stringify(schema);
    // Remove whitespace in the JSON
    const json_no_ws = JSON.stringify(JSON.parse(json));

    // The default model type/payload type is Parquet/IPFS
    // unless it is a graphChange schema which is AvroBinary/OnChain.
    if (schemaName === "graphChange") {
      extrinsic = api.tx.schemas.registerSchema(json_no_ws, "AvroBinary", "OnChain");
    } else {
      extrinsic = api.tx.schemas.registerSchema(json_no_ws, "Parquet", "IPFS");
    }
    // console.log(extrinsic)

    /* eslint-disable @typescript-eslint/no-explicit-any */
    await extrinsic?.signAndSend(serviceKeys, { nonce: -1 });
  }
};
