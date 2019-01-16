#!/bin/sh
echo "Checking if code meets lint rules."
npm run lint
echo "Running unit tests and coverage test."
npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI --code-coverage
echo "Running E2E tests."
npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js
