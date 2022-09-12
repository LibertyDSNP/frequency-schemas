# schemas
Official DSNP on Frequency Schema Source Code

# deploy
To deploy/register schemas:

    npm run deploy profile

by default it will deploy to the `localhost` node on port 9944 using the Alice test account.

Two environment variables allow you to change these defaults:

    DEPLOY_SCHEMA_ACCOUNT_URI="//Alice"
    DEPLOY_SCHEMA_ENDPOINT_URL="ws://localhost:9944"

e.g.

    DEPLOY_SCHEMA_ACCOUNT_URI="//Bob" DEPLOY_SCHEMA_ENDPOINT_URL="ws://localhost:9944" npm run deploy profile