#!/bin/bash
grep version package.json |awk '{print $2}'| sed s'/.$//'| sed 's/.//;s/.$//' >VERSION
rm -rf build
mkdir build
rm -rf target
mkdir target
yarn install
yarn zip
