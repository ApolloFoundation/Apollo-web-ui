Apollo Web UI
========================================

Aboolo web UI is code base that is used for Apollo web wallet, appollo desktop and mobile Apollo wallet.

From this code base following 

# Build instructions

## Requirements
Latest NodeJS LTS version is required to develop and build Apollo Web UI.
It could be downloaded from [NodeJS official site](https://nodejs.org/uk/).

For developers (Linux, OS X)[Node Version Manager](https://github.com/nvm-sh/nvm) is highly recommended. If you use Windows OS, please consider to try [Node Version Manager (nvm) for Windows](https://github.com/coreybutler/nvm-windows).

Current version of Apollo-web-ui is built using NodeJS version v12.16.x

__Yarn__ is the build tool for Apollo-web-ui.
To install  __yarn__, please run following command in terminal window:
```
	npm install -g yarn
``` 

There is no specific requirements to run production build of Apollo-Web-ui. Apollo-blockchain module detects that Apollo-Web-ui is installet and runs it authomatically. To access UI, open your browser with URL: http://localhost:7876
 

## Development builds

To run Apollo-web-ui in development mode, please run following command:

```
yarn install
yarn start
```

This command start browser with URL: http://localhost:3030/. Note, that you need Apollo-blockchain running locally to Apollo-Web-ui. Please refer to [Apollo](https://github.com/ApolloFoundation/Apollo) sub-project for build and installation instructions.

## Production build

### Build for Apollo node
```
yarn install
yarn build
```
Final installation artefact is zip file in "target" directory.  

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

1. Switch Java version `export JAVA_HOME='/usr/libexec/java_home -v 11.0.2'`
2. Build `mvn -DskipTests=true clean package`
3. Copy directory `apl-exec/target/apollo-wallet-1.41.12.tar.gz`
4. `cd bin/`
5. `./apl-start.sh -s -n 2 --no-shards-import true`
6. `./apl-start-desktop.sh`
7. `./apl-stop.sh`

## GIT branches

We follow GIT FLOW procedure in our developemnt and use following branhces:

__master__ branch contains stable code of the latest release. It is also tagged for each public release. Please see "Tags" in the "barcnh" dropdown menu. Plea
se use this branch to compile Apollo components.

__develop__ branch contains latest development version. Use this branch if you are developer/contributor.

__stage__ branch contains release preparation work of the last release. Do not use this branch if you are not release engineer


fix/*, feature/*, bugfix/** - temporary branches used by developers. Ususaly those branmches get merged to ___develop___ and deleted after work is done
