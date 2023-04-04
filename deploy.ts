import type { EventRecord } from "@polkadot/types/interfaces/system";

import { getFrequencyAPI, getSignerAccountKeys } from "./services/connect";
import { dsnpSchemas } from "./dsnp";

export const deploy = async () => {
  console.log("Deploy of Schemas Starting...");

  // Process arguments
  const args = process.argv.slice(2);

  let schema_names: string[];

  if (args.length == 0) {
    schema_names = [...dsnpSchemas.keys()];
  } else if (args.length == 1) {
    // Does schema with name exist?
    const schemaName = args[0];
    const sc = dsnpSchemas.get(schemaName);
    if (sc == undefined) {
      console.error("ERROR: No specified schema with name.");
      process.exit(1);
    } else {
      schema_names = [schemaName];
    }
  } else {
    console.error("ERROR: You can only specify a single schema to create or all schemas if not specified.");
    process.exit(1);
  }

  await createSchemas(schema_names);
};

// Given a list of events, a section and a method,
// returns the first event with matching section and method.
const eventWithSectionAndMethod = (events: EventRecord[], section: string, method: string) => {
  const evt = events.find(({ event }) => event.section === section && event.method === method);
  return evt?.event;
};

// Given a list of schema names, attempt to create them with the chain.
const createSchemas = async (schema_names: string[]) => {
  const promises = [];
  const api = await getFrequencyAPI();
  const signerAccountKeys = getSignerAccountKeys();

  // Retrieve the current account nonce so we can increment it when submitting transactions
  let nonce = (await api.rpc.system.accountNextIndex(signerAccountKeys.address)).toNumber();

  for (const schemaName of schema_names) {
    console.log("Attempting to create " + schemaName + " schema.");

    // Get the schema from the name
    const schemaDeploy = dsnpSchemas.get(schemaName);
    if (!schemaDeploy) throw `Unknown Schema name: ${schemaName}`;
    // Create JSON from the schema object
    const json = JSON.stringify(schemaDeploy?.model);
    // Remove whitespace in the JSON
    const json_no_ws = JSON.stringify(JSON.parse(json));

    const promise = new Promise<void>((resolve, reject) => {
      api.tx.schemas
        .createSchema(json_no_ws, schemaDeploy.modelType, schemaDeploy.payloadLocation)
        .signAndSend(signerAccountKeys, { nonce: nonce++ }, ({ status, events, dispatchError }) => {
          if (dispatchError) {
            console.log("ERROR: " + dispatchError.toHuman());
            reject();
          } else if (status.isInBlock || status.isFinalized) {
            const evt = eventWithSectionAndMethod(events, "schemas", "SchemaCreated");
            if (evt) {
              const val = evt?.data[1];
              console.log("SUCCESS: " + schemaName + " schema created with id of " + val);
            }
            resolve();
          }
        });
    });
    promises.push(promise);
  }
  return Promise.all(promises);
};
