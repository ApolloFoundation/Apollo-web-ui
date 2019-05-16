Main Instruction
========================================
### Development
```
npm install
npm start
```

### Deployment to dev
```
npm install
npm run build
```

### Create IOS & Android builds
1. `npm i`
2. `npm run build`
3. Copy all from `build` directory to `www/` directory from Cordova project (from archive)
4. In Cordova project run `cordova build android` || `cordova build ios`
5.  - For Android `.apk` will be in `/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
    - For IOS - open in Xcode project

### Run server (from backend Apollo repository)
1. `mvn clean install -DskipTests=true`
2. `java -jar apl-exec/target/apl-exec-1.30.16.jar`

To change testnet go to `apl-core/src/main/resources-dev/conf/chains.json` and set parameter `"active": true`

### Run desktop app (from backend Apollo repository)
1. `mvn clean install -Pprod`
2. `cd bin/`
3. `java -jar ../apl-exec/target/lib/apl-desktop-1.30.16.jar`