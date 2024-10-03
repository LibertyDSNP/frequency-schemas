# Official DSNP over Frequency Schemas

**Matching DSNP Version: v1.3.0**

## Use Schemas as Library

### Install
```sh
npm install @dsnp/frequency-schemas
```

### Use Parquet or Avro Schema

```typescript
import { dsnp } from "@dsnp/frequency-schemas";

console.log(dsnp.getSchema("broadcast"));
```

### Get Schema Id for Connected Chain

```typescript
import { dsnp } from "@dsnp/frequency-schemas";
import { ApiPromise } from "@polkadot/api";

const api = ApiPromise.create(/* ... */);
console.log(dsnp.getSchemaId("broadcast", "1.3", api.genesisHash.toString()));
```

The API connection is used only to identify the chain by its genesis hash.

Frequency chains have well-known Ids defined in `dsnp/index.ts`.
However, it is possible to configure a custom mapping if needed:

```
dsnp.setSchemaMapping(api.genesisHash.toString(), {
  // format is dsnpName: { version: schemaId, ... }
  "tombstone": { "1.2": 64 },
  "broadcast": { "1.2": 67 },
  // ...
});

console.log(dsnp.getSchemaId("broadcast", "1.2", api.genesisHash.toString())); // yields 67
```

### With Parquet Writer

```sh
npm install @dsnp/parquetjs
```

```typescript
import { parquet } from "@dsnp/frequency-schemas";
import { ParquetWriter } from "@dsnp/parquetjs";

const [parquetSchema, writerOptions] = parquet.fromFrequencySchema("broadcast");
const writer = await ParquetWriter.openFile(parquetSchema, "./file.parquet", writerOptions);
writer.appendRow({
  announcementType: 2,
  contentHash: "0x1234567890abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  fromId: 78187493520,
  url: "https://spec.dsnp.org/DSNP/Types/Broadcast.html",
});
await writer.close();
```

## Use to Deploy Schemas

### Setup

1. Pull the repository
1. Install dependencies `npm install`

## Usage

### To register a single schema

e.g. To register the "profile-resources" schema

    npm run deploy profile-resources

by default it will deploy to the `localhost` node on port 9944 using the Alice sudo test account.

Two environment variables allow you to change these defaults:

```sh
DEPLOY_SCHEMA_ACCOUNT_URI="//Alice"
DEPLOY_SCHEMA_ENDPOINT_URL="ws://localhost:9944"
```

e.g.

```sh
DEPLOY_SCHEMA_ACCOUNT_URI="//Bob" DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run deploy profile-resources
```

**Note:** Requires a sudo key if deploying to a testnet.
Mainnet will use the proposal system (`proposeToCreateSchema`).

## Additional Tools

## Help

```sh
npm run deploy help
```

## Read all Schemas from a Chain

```sh
DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run read
```

Will output various information about the schemas on the chain as well as attempt to match known DSNP schemas.

### Example Output

```
## Connection Information
┌─────────┬─────────────────────┬────────────────────────────────────────────┐
│ (index) │         key         │                   value                    │
├─────────┼─────────────────────┼────────────────────────────────────────────┤
│    0    │    'endpointUrl'    │ 'wss://frequency-seal.liberti.social:9944' │
│    1    │   'clientVersion'   │            '0.1.0-377bbe37fbe'             │
│    2    │     'specName'      │             'frequency'                    │
│    3    │    'specVersion'    │                    '1'                     │
│    4    │ 'latestBlockNumber' │                    '16'                    │
└─────────┴─────────────────────┴────────────────────────────────────────────┘

## Schema Information
There are 8 schemas on the connected chain.

## Schema Id 1
┌─────────┬──────────────────────┬───────────────────────────────┐
│ (index) │         key          │             value             │
├─────────┼──────────────────────┼───────────────────────────────┤
│    0    │     'schema_id'      │              '1'              │
│    1    │     'model_type'     │           'Parquet'           │
│    2    │  'payload_location'  │            'IPFS'             │
│    3    │ 'matchesDSNPSchemas' │       'dsnp.broadcast'        │
└─────────┴──────────────────────┴───────────────────────────────┘

## Schema Model
[
  {
    "name": "announcementType",
    "column_type": {"INTEGER": {"bit_width": 32, "sign": true}},
    "compression": "GZIP",
    "bloom_filter": false
  },
  {
    "name": "contentHash",
    "column_type": "BYTE_ARRAY",
    "compression": "GZIP",
    "bloom_filter": true
  },
  {
    "name": "fromId",
    "column_type": {"INTEGER": {"bit_width": 64, "sign": false}},
    "compression": "GZIP",
    "bloom_filter": true
  },
  {
    "name": "url",
    "column_type": "STRING",
    "compression": "GZIP",
    "bloom_filter": false
  }
]
...
```

## Find Frequency Schema Ids that Match DSNP Schema Versions

This script will look up and verify schemas in the schema registry that match the DSNP names and versions defined in `dsnp/index.ts`.

```sh
DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run find
```
