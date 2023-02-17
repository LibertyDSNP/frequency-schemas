#!/bin/bash

set -m

#Useful for future debugging
npm --version
ldd --version
whoami

/frequency/frequency --dev \
    -lruntime=debug \
    --instant-sealing \
    --no-telemetry \
    --no-prometheus \
    --port=30333 \
    --rpc-port=9933 \
    --ws-port=9944 \
    --rpc-external \
    --rpc-cors=all \
    --ws-external \
    --rpc-methods=Unsafe \
    --base-path=/data \
    &

cd frequency/schemas
npm run deploy

fg %1
