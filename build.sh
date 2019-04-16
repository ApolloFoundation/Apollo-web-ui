#!/bin/bash
grep version package.json |awk '{print $2}'|sed s'/.$//' > VERSION
VERS1=`cat VERSION`
VERS2=`echo ${VERS1:1:-1}`
rm -rf build
mkdir build
npm install
npm run build