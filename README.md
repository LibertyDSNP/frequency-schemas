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

# dsnp/instant-seal-node-with-deployed-schemas
## Pushing Docker Image
This repo includes a docker image to push an instant-seal-node with the schemas deployed on top of it to docker hub under dsnp/instant-seal-node-with-deployed-schemas.
To match with the frequency version, a new tag should be pushed to update the docker version of this image each time frequency releases a new version.
The following steps explain how to properly do a release for this.
1. Go to the [frequency repo](https://github.com/LibertyDSNP/frequency/releases) to see what the latest release version is.
2. In this repo, check that main is properly passing its tests and building [here](https://github.com/LibertyDSNP/schemas/actions)
3. Go to main: `git checkout main && git pull --rebase`
4. Make sure to pull all latest tags as well: `git pull --tags`
5. Tag the build to match the frequency version but appended with "docker/": `git tag docker/{insert version number}`. For example, if the version number is v1.0.0, then the tag should be `docker/v1.0.0`
Push the tag up: `git push --tags`
6. Monitor the [build](https://github.com/LibertyDSNP/schemas/actions)
7. When that finishes successfully, check [docker hub](https://hub.docker.com/r/dsnp/instant-seal-node-with-deployed-schemas/tags) to verify that the image was pushed up

## To run locally
For any local testing do the following:
1. `docker pull dsnp/instant-seal-node-with-deployed-schemas:latest`
2. `docker run docker run --rm -p 9944:9944 -p 9933:9933 -p 30333:30333 dsnp/instant-seal-node-with-deployed-schemas:latest`
