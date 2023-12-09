import { getFrequencyAPI } from "./services/connect.js";
import { schemas } from "../dsnp/index.js";

const find = async () => {
  const api = await getFrequencyAPI();

  console.log("\n## DSNP Schema Information");

  for (const schemaEntry of schemas.entries()) {
    const schemaString = JSON.stringify(schemaEntry[1].model);
    const schemaVersionResult = (await api.rpc.schemas.getVersions("dsnp." + schemaEntry[0])).unwrap();
    for (const version of schemaVersionResult) {
      const schemaResult = (await api.rpc.schemas.getBySchemaId(version.schema_id.toString())).unwrap();
      const jsonSchema = Buffer.from(schemaResult.model).toString("utf8");
      const { schema_id, model_type, payload_location, settings } = schemaResult;

      // Ensure that full entry details match, otherwise it's a different version
      if (
        schemaString === jsonSchema &&
        model_type.toHuman() === schemaEntry[1].modelType &&
        payload_location.toHuman() === schemaEntry[1].payloadLocation &&
        JSON.stringify(settings.toHuman()) === JSON.stringify(schemaEntry[1].settings)
      ) {
        console.log(`\n## Schema Id ${schema_id}`);
        console.table(
          Object.entries({
            schemaName: schemaEntry[0],
            dsnpVersion: schemaEntry[1].dsnpVersion,
            schemaId: schema_id.toHuman(),
          }).map(([key, value]) => ({ key, value })),
        );
      }
    }
  }
};

export const main = async () => {
  await find();
};

main().catch(console.error).finally(process.exit);
