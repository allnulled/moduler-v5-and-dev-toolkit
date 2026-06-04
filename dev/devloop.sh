#!/usr/bin/bash

DIR2="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$DIR2"
cd ..

node dev/build.js $1 --from devloop