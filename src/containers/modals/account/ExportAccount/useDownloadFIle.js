import { useCallback } from "react";
import {NotificationManager} from 'react-notifications';
import util from "../../../../helpers/util/utils";

export const useDownloadFile = (accountKeySeedData) => {
  const writeFile = useCallback(() => {
    const filename = `${accountKeySeedData.account}.apl`;
    let base64 = `data:application/octet-stream;df:${filename};base64,${accountKeySeedData.file}`;
    let subject = null;
    if (window.cordova.platformId === "android") {
        base64 = `data:application/;base64,${accountKeySeedData.file}`;
        subject = filename;
    }
    const uri = encodeURI(base64);

    const options = {
        message: null,
        subject,
        files: [uri],
        url: null,
        chooserTitle: 'Export Account',
    };

    const onError = (msg) => {
        console.log("Downloading failed with message: " + msg);
        NotificationManager.error('Downloading Secret File failed', 'Error', 5000);
    };

    window.plugins.socialsharing.shareWithOptions(options, null, onError);
  }, [accountKeySeedData]);

  const checkPermissionCallback = useCallback((status) => {
    if (!status.hasPermission) {
        const errorCallback = () => {
            console.warn('Storage permission is not turned on')
        };
        window.cordova.plugins.permissions.requestPermission(
            window.cordova.plugins.permissions.WRITE_EXTERNAL_STORAGE,
            (status) => {
                if (!status.hasPermission) {
                  errorCallback();
                } else {
                  writeFile();
                }
            },
            errorCallback
        );
    } else {
        writeFile();
    }
  }, [writeFile]);

  const downloadFile = useCallback(() => {
    if (window.cordova && window.plugins) {
        let permissions = window.cordova.plugins.permissions;
        permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, checkPermissionCallback, null);
    }
    if (util.isDesktopApp() && window.java) {
        window.java.downloadFile(accountKeySeedData.file, `${accountKeySeedData.account}.apl`);
    }
  }, [accountKeySeedData, checkPermissionCallback]);

  return downloadFile;
}