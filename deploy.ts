
import { ExitStatus } from "typescript";
import broadcast from "./dsnp/broadcast";
import graphChange from "./dsnp/graphChange";
import profile from "./dsnp/profile";
import reaction from "./dsnp/reaction";
import reply from "./dsnp/reply";
import tombstone from "./dsnp/tombstone";
import update from "./dsnp/update";
import {requireGetProviderApi, requireGetServiceKeys, DsnpCallback, DsnpErrorCallback} from "./services/connect";

export const deploy = async () => {
  console.log("Deploy of Schemas Starting...");

  const args = process.argv.slice(2);

  console.log(args);

  let succeeded = () => {
    console.log("OK");
  };
  let failed = () => {
    console.log("ERROR");
  }

  const api = await requireGetProviderApi();
  console.log(api.genesisHash.toHex());
  await registerSchema(succeeded, failed);
};

const registerSchema = async (callback: DsnpCallback, errorCallback: DsnpErrorCallback) => {

  console.log("registerSchema()");

  console.log("API");
  const api = await requireGetProviderApi();
  console.dir(api);

  const serviceKeys = requireGetServiceKeys();
  console.log("SERVICE KEYS");
  console.dir(serviceKeys);

  const schemas = [broadcast, profile, reaction, reply, tombstone, update];
  
  let extrinsic;

  for (const schema of schemas) {
    extrinsic =  api.tx.schemas.registerSchema(JSON.stringify(schema), 'Parquet' , 'OnChain');

    console.log(extrinsic);
  
    await extrinsic?.signAndSend(serviceKeys, {nonce: -1},
        ({status, events}) => {
        callback(status, events);
    })
    .catch((error: any) => {
        errorCallback(error);
    });  
  }

}

