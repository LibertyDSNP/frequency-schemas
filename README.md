# schemas
Official DSNP on Frequency Schema Source Code

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
