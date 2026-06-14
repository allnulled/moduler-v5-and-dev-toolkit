#!/usr/bin/bash

DIR2="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$DIR2"
cd ..

pwd > cwd.txt
# -x 'node dev/build.js @{refrescador.file}' \

./dist/dev-toolkit/refrescador.cli.dist.js \
    -w "$(pwd)" \
    -i "**/node_modules/**/*" \
    -i "**/dist/**/*" \
    -i "**/*.dist.*" \
    -i "**/coverage/**/*" \
    -i "**/.nyc_output/**/*" \
    -i "**/dist-instrumented/**/*" \
    -i "**/tests-assets/file-watcher/**/*" \
    -i "**/tests-assets/devtoolkit-cli.test/**/*" \
    -i "**/tests-assets/devtoolkit-documentator.test/**/*" \
    -i "**/tests-assets/events/**/*" \
    -i "**/semaphore.*" \
    -i "**/API.md" \
    -i "**/README.md" \
    -i "**/blank-project/**/*" \
    -d 0 \
    -mf "TODO.md" \
    -e "sh" \
    -e "ts" \
    -e "tsx" \
    -e "txt" \
    -e "js" \
    -e "json" \
    -e "css" \
    -e "html" \
    -e "md" \
    -x 'bash dev/devloop.sh @{refrescador.file}' \