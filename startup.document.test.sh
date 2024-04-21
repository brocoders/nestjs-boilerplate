#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh mongo:27017
/opt/wait-for-it.sh maildev:1080
npm install
npm run seed:run:document
npm run start:swc
