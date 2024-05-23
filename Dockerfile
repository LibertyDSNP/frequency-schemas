# Docker image for running Frequency parachain node container (with collating)
# locally in instant seal mode then deploying schemas to that node.

#This pulls the latest standalone-node image
FROM frequencychain/standalone-node:v1.12.0-rc3 as frequency-image

#Switch to root to install node on image
USER root

LABEL maintainer="Frequency"
LABEL description="Frequency collator node in instant seal mode with schemas deployed"

RUN apt-get update \
    && apt-get install -y ca-certificates \
    && update-ca-certificates

# Install node-js to base image
RUN apt-get update && apt-get install -y curl gnupg \
        && curl -sL https://deb.nodesource.com/setup_18.x | bash \
        && apt-get update && apt-get install -y nodejs \
        && rm -rf /var/lib/apt/lists/*

# Switch back to frequency user

USER frequency

# Copy over deploy_schemas script to base image
COPY --chown=frequency scripts/deploy_schemas_to_node.sh ./frequency/
RUN chmod +x ./frequency/deploy_schemas_to_node.sh

# Copy over schemas repo
RUN mkdir frequency/schemas
COPY --chown=frequency ./ ./frequency/schemas
RUN cd frequency/schemas \
    && npm install \
    && cd $WORKSPACE

# Install tini to use as new entrypoint
ENV TINI_VERSION v0.19.0
ADD --chown=frequency https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# 9944 for RPC/Websocket
EXPOSE 9944

VOLUME ["/data"]

HEALTHCHECK --start-period=15s \
  CMD curl --silent --fail -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "schemas_getBySchemaId", "params": [11]}' http://localhost:9944/ | grep -qv '{"jsonrpc":"2.0","result":null,"id":1}' || exit 1

ENTRYPOINT ["/tini", "--", "frequency/deploy_schemas_to_node.sh"]
