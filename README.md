# Official DSNP on Frequency Schema Source Code

**Matching DSNP Version: v1.2.0-pre**

# install

    npm install

# deploy
To deploy/register all schemas:

    npm run deploy

by default it will deploy to the `localhost` node on port 9944 using the Alice test account.

Two environment variables allow you to change these defaults:

    DEPLOY_SCHEMA_ACCOUNT_URI="//Alice"
    DEPLOY_SCHEMA_ENDPOINT_URL="ws://localhost:9944"

e.g.

    DEPLOY_SCHEMA_ACCOUNT_URI="//Bob" DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run deploy profile

To register a single schema:

e.g. To register the "profile" schema

    npm run deploy profile

# Additional Tools

## Read all Schemas from a Chain

```
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
│    2    │     'specName'      │             'frequency-rococo'             │
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
│    3    │ 'matchesDSNPSchemas' │ 'dsnp.broadcast,dsnp.profile' │
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
