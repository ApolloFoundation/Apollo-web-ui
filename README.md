Main Instruction
========================================
### Development
```
yarn install
yarn start
```

### Deployment to dev
```
yarn install
yarn build
```

### Create IOS & Android builds
1. Set `PUBLIC_URL=./` in .env file
2. Install node modules - `yarn install`
3. Create production build - `yarn build`
4. Copy all from `build` directory to `www/` directory from Cordova project (from archive)
5. In Cordova project run `cordova build android` || `cordova build ios`
6.  - For Android `.apk` will be in `/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
    - For IOS - open in Xcode project

### Run server (from backend Apollo repository)
1. `mvn clean install -DskipTests=true`
2. `java -jar apl-exec/target/apl-exec-1.41.5.jar -n 3 --no-shards-import true`

To change testnet: change number in `-n 3`

### Run desktop app (from backend Apollo repository)
1. `mvn clean install -Pprod`
2. `cd bin/`
3. `java -jar ../apl-exec/target/lib/apl-desktop-1.30.16.jar`