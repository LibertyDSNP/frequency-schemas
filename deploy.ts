import type { EventRecord } from "@polkadot/types/interfaces/system";

import { getFrequencyAPI, getSignerAccountKeys } from "./services/connect";
import { dsnpSchemas } from "./dsnp";

export const deploy = async () => {
  // Process arguments
  const args = process.argv.slice(2);

  let schema_names: string[];

  if (args.length == 0) {
    schema_names = [...dsnpSchemas.keys()];
  } else if (args.length > 0 && args.includes("help")) {
    console.log(
      [
        "Deploy Schemas Script",
        "",
        "Environment Variables:",
        "- DEPLOY_SCHEMA_ACCOUNT_URI",
        "- DEPLOY_SCHEMA_ENDPOINT_URL",
        "",
        'Example: DEPLOY_SCHEMA_ACCOUNT_URI="//Bob" DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run deploy',
        "",
      ].join("\n")
    );
    console.log("Available Schemas:\n-", [...dsnpSchemas.keys()].join("\n- "));
    process.exit();
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

  console.log("Deploy of Schemas Starting...");

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
  const promises: Promise<void>[] = [];
  const api = await getFrequencyAPI();
  const signerAccountKeys = getSignerAccountKeys();
  // Mainnet genesis hash means we should propose instead of create
  const shouldPropose =
    api.genesisHash.toHex() === "0x4a587bf17a404e3572747add7aab7bbe56e805a5479c6c436f07f36fcc8d3ae1";

  if (shouldPropose && schema_names.length > 1) {
    console.error("Proposing to create schemas can only occur one at a time. Please try again with only one schema.");
    process.exit(1);
  }

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

    if (shouldPropose) {
      // Propose to create
      const promise = new Promise<void>((resolve, reject) => {
        api.tx.schemas
          .proposeToCreateSchema(
            json_no_ws,
            schemaDeploy.modelType,
            schemaDeploy.payloadLocation,
            schemaDeploy.settings
          )
          .signAndSend(signerAccountKeys, { nonce: nonce++ }, ({ status, events, dispatchError }) => {
            if (dispatchError) {
              console.error("ERROR: ", dispatchError.toHuman());
              console.log("Might already have a proposal with the same hash?");
              reject();
            } else if (status.isInBlock || status.isFinalized) {
              const evt = eventWithSectionAndMethod(events, "council", "Proposed");
              if (evt) {
                const id = evt?.data[1];
                const hash = evt?.data[2].toHex();
                console.log("SUCCESS: " + schemaName + " schema proposed with id of " + id + " and hash of " + hash);
              }
              resolve();
            }
          });
      });
      promises.push(promise);
    } else {
      // Create directly via sudo
      const tx = api.tx.schemas.createSchemaViaGovernance(
        signerAccountKeys.address,
        json_no_ws,
        schemaDeploy.modelType,
        schemaDeploy.payloadLocation,
        schemaDeploy.settings
      );
      const promise = new Promise<void>((resolve, reject) => {
        api.tx.sudo.sudo(tx).signAndSend(signerAccountKeys, { nonce: nonce++ }, ({ status, events, dispatchError }) => {
          if (dispatchError) {
            console.error("ERROR: ", dispatchError.toHuman());
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
  }
  return Promise.all(promises);
};
