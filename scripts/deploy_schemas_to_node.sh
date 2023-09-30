#!/bin/bash

set -m

#Useful for future debugging
npm --version
ldd --version
whoami

/frequency/frequency --dev \
    -lruntime=debug \
    --sealing=instant \
    --no-telemetry \
    --no-prometheus \
    --port=30333 \
    --rpc-port=9944 \
    --rpc-external \
    --rpc-cors=all \
    --rpc-methods=Unsafe \
    --base-path=/data \
    &

cd frequency/schemas
npm run deploy

touch successTouchFile
echo "CREATED TOUCHFILE"

fg %1
