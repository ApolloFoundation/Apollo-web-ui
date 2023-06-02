# Apollo Web UI

Apollo is being developed by the Apollo Foundation and supporting members of the community.

This repository contains web wallet UI that is served by Apollo blockchain node and can be accessed by browser at http://localhost:7876.

## Disclaimer
Apollo team is actively working on modularity of Apollo blockchain so build scripts and source structure is subject of changes. Apollo project consists of several modules written in different programming languages. If you are not an expert in Java and Maven, JavaScript, NodeJs, npm, yarn, please use our release builds at [Apollo Releases page](https://github.com/ApolloFoundation/Apollo/releases).

If you feel like an expert, please use build instructions below. But also please note that instructions may be slightly outdated, especially in "development" branches of the Apollo project repositories.


## Apollo components
There are other components that are parts of Apollo:

1. [Apollo](https://github.com/ApolloFoundation/Apollo): Core classes of Apollo blockchain platform and main executable of Apollo-blockchain component.
2. [Apollo-dektop](https://github.com/ApolloFoundation/Apollo-desktop): Desktop wallet UI. Apollo-web-ui must be installed tobe able to run Apollo desktop wallet.
3. [Apollo-tools](https://github.com/ApolloFoundation/Apollo-tools): "swiss knife" of tools for node maintenance, transaction signing, etc.
4. [Apollo-bom-ext](https://github.com/ApolloFoundation/Apollo-bom-ext): This module required in compilation time oly. It contains BOM of all external libraries used by Apollo components.


## Requirements

It is required to have Nodejs v18.х.x installed to develop and build Apollo Web UI.
It could be downloaded from [NodeJS official site](https://nodejs.org/dist/latest-v18.x/).

For developers (Linux, OS X)[Node Version Manager](https://github.com/nvm-sh/nvm) is highly recommended.

If you use Windows OS, please consider trying [Node Version Manager (nvm) for Windows](https://github.com/coreybutler/nvm-windows).

**NOTE**: Before install of NVM(Node Version Manager) for Windows or Linux, firstly please delete NodeJs from your PC (NVM can overwrite your settings, may conflict with installed NodeJS).

There are no specific requirements to run production build of Apollo-Web-ui. Apollo-blockchain module detects that Apollo-Web-ui is installed and runs it automatically. To access UI, open your browser with URL: http://localhost:7876



## Preparation steps ##

Please, duplicate `.env.skel` to `.env` file.
Here you can find `REACT_APP_PROXY_HOST` option, where you can change backend server.
For example:
```
REACT_APP_PROXY_HOST=http://51.15.102.159:7876
```

## Development builds

To run Apollo-web-ui in development mode, please run following command:

```
npm install
npm start
```
Final installation artefact is zip file in "target" directory.


## GIT branches

We follow GIT FLOW procedure in our development and use following branches:

__master__ branch contains stable code of the latest release. It is also tagged for each public release. Please see "Tags" in the "branch" dropdown menu. Please use this branch to compile Apollo components.

__develop__ branch contains latest development version. Use this branch if you are developer/contributor.

__stage__ branch contains release preparation work of the last release. Do not use this branch if you are not release engineer


This command start browser with URL: http://localhost:3030/.

## Production build

### Build for Apollo node
```
npm install
npm run build
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

## GIT branches

We follow GIT FLOW procedure in our development and use following branches:

__master__ branch contains stable code of the latest release. It is also tagged for each public release. Please see "Tags" in the "branch" dropdown menu. Please use this branch to compile Apollo components.

__develop__ branch contains latest development version. Use this branch if you are developer/contributor.

__stage__ branch contains release preparation work of the last release. Do not use this branch if you are not release engineer


fix/*, feature/*, bugfix/** - temporary branches used by developers. Usually those branches get merged to ___develop___ and deleted after work is done.
