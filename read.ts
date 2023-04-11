import "@frequency-chain/api-augment";
import { getEndpoint, getFrequencyAPI } from "./services/connect";

import stringify from "json-stringify-pretty-compact";

import { dsnpSchemas } from "./dsnp";

const nameAndSchema = Array.from(dsnpSchemas.entries(), ([k, v]) => [`dsnp.${k}`, JSON.stringify(v.model)]);

const read = async () => {
  const api = await getFrequencyAPI();

  const { specName, specVersion } = await api.runtimeVersion;
  const clientVersion = await api.rpc.system.version();
  const endpointUrl = getEndpoint();

  const latestBlockNumber = await api.query.system.number();

  const connectionInfo = { endpointUrl, clientVersion, specName, specVersion, latestBlockNumber };
  console.log("\n## Connection Information");
  console.table(Object.entries(connectionInfo).map(([key, value]) => ({ key, value: value.toString() })));

  console.log("\n## Schema Information");
  const maxSchemaId = (await api.query.schemas.currentSchemaIdentifierMaximum()).toNumber();
  console.log(`There are ${maxSchemaId} schemas on the connected chain.`);

  for (let i = 1; i <= maxSchemaId; i++) {
    const schemaResult = (await api.rpc.schemas.getBySchemaId(i)).unwrap();
    const jsonSchema = Buffer.from(schemaResult.model).toString("utf8");
    const modelParsed = JSON.parse(jsonSchema);
    const { schema_id, model_type, payload_location } = schemaResult;

    // Check for matches
    const matchesDSNPSchemas = nameAndSchema.reduce((arr, [schemaName, schemaString]) => {
      if (schemaString === jsonSchema) arr.push(schemaName);
      return arr;
    }, []);

    console.log(`\n## Schema Id ${schema_id}`);
    console.table(
      Object.entries({
        schema_id,
        model_type,
        payload_location,
        matchesDSNPSchemas,
      }).map(([key, value]) => ({ key, value: value.toString() }))
    );
    console.log("\n## Schema Model");
    console.log(stringify(modelParsed));
  }
};

export const main = async () => {
  await read();
};

main().catch(console.error).finally(process.exit);
