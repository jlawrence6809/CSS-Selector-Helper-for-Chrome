#!/bin/bash

echo 'Building extension...'
npm run build

echo 'Creating zip package...'
cd build && zip -r ../css-selector-helper.zip . && cd ..

echo 'Done! Created css-selector-helper.zip'

