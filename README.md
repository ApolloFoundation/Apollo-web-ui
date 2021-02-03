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

It is required to have Nodejs v12.16.x installed to develop and build Apollo Web UI.
It could be downloaded from [NodeJS official site](https://nodejs.org/dist/v12.16.1/).

For developers (Linux, OS X)[Node Version Manager](https://github.com/nvm-sh/nvm) is highly recommended.

If you use Windows OS, please consider trying [Node Version Manager (nvm) for Windows](https://github.com/coreybutler/nvm-windows).

**NOTE**: Before install of NVM(Node Version Manager) for Windows or Linux, firstly please delete NodeJs from your PC (NVM can overwrite your settings, may conflict with installed NodeJS).

There are no specific requirements to run production build of Apollo-Web-ui. Apollo-blockchain module detects that Apollo-Web-ui is installed and runs it automatically. To access UI, open your browser with URL: http://localhost:7876



### Node Version Manager usage

In the root of the project:

 * Verify your NVM installation: (Windows: `nvm v`, Linux: `nvm -v` in console). Output example: 
 
```
1.1.7
```
* Install the Nodejs of the required version: 

```nvm install 12.16.1```

* Check versions of node: `node -v` (must be a list with versions of NodeJS which was installed). Output example:

```
node -v
12.16.1
```

* For use the version you want, if you have multiple versions installed: 

```nvm use 12.16.1```

## Preparation steps ##

In `src/config.js` you need to set server URL. For example:
```
server: 'http://localhost:7876',
```
Note, that you need Apollo-blockchain running locally to Apollo-Web-ui. Please refer to [Apollo](https://github.com/ApolloFoundation/Apollo) sub-project for build and installation instructions of blockchain backend.


## Development builds

To run Apollo-web-ui in development mode, please run following command:

```
npm install
npm start
```

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
