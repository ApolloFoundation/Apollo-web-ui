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
5. 
- For Android `.apk` will be in `/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- For IOS - open in Xcode project
