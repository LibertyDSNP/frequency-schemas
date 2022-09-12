import broadcast from "./dsnp/broadcast";
import graphChange from "./dsnp/graphChange";
import profile from "./dsnp/profile";
import reaction from "./dsnp/reaction";
import reply from "./dsnp/reply";
import tombstone from "./dsnp/tombstone";
import { ParquetModel } from "./types/frequency";
import update from "./dsnp/update";
import { requireGetProviderApi, requireGetServiceKeys, DsnpCallback, DsnpErrorCallback } from "./services/connect";

export const deploy = async () => {
  console.log("Deploy of Schemas Starting...");

  const args = process.argv.slice(2);

  let schemas: (ParquetModel | object)[] = [];

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

  // Process arguments
  switch (args.length) {
    case 0:
      schemas = [broadcast, profile, reaction, reply, tombstone, update, graphChange];
      break;
    case 1:
      const sc = nameToSchema.get(args[0]);
      if (sc == undefined) {
        console.error("ERR: No specified schema with name.");
        process.exit();
      } else {
        schemas = [sc];
      }
      break;
    default:
      console.error("ERR: You can only specify a single schema to register or all schemas if not specified.");
      process.exit();
      break;
  }

  const succeeded = () => {
    console.log("OK");
  };
  const failed = () => {
    console.log("ERROR");
  };

  await registerSchema(schemas, succeeded, failed);
};

const registerSchema = async (
  schemas: (ParquetModel | object)[],
  callback: DsnpCallback,
  errorCallback: DsnpErrorCallback
) => {
  const api = await requireGetProviderApi();
  const serviceKeys = requireGetServiceKeys();

  let extrinsic;

  for (const schema of schemas) {
    // Remove whitespace
    const json = JSON.stringify(schema);
    const json_no_ws = JSON.stringify(JSON.parse(json));

    // The default model type/payload type is Parquet/IPFS
    // unless it is a graphChange schema which is AvroBinary/OnChain.
    if (schema === graphChange) {
      extrinsic = api.tx.schemas.registerSchema(json_no_ws, "AvroBinary", "OnChain");
    } else {
      extrinsic = api.tx.schemas.registerSchema(json_no_ws, "Parquet", "IPFS");
    }
    // console.log(extrinsic);

    await extrinsic
      ?.signAndSend(serviceKeys, { nonce: -1 }, ({ status, events }) => {
        callback(status, events);
      })
      .catch((error: any) => {
        errorCallback(error);
      });
  }
};
