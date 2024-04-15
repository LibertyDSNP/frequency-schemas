#!/bin/bash

set -m

#Useful for future debugging
npm --version
ldd --version
whoami

# Base image start script
/frequency/frequency-start.sh $* &

cd frequency/schemas
npm run deploy

touch successTouchFile
echo "CREATED TOUCHFILE"

fg %1
