import { useCallback } from "react";
import { NotificationManager } from "react-notifications";

const enableCommonStyles = () => {
  const { body } = document;
  document.querySelector('body').style.backgroundColor = '#F5F7FC';
  document.querySelector('#root').style.visibility = '';
  document.querySelector('.modal-window').style.visibility = '';
  document.querySelector('.scannerWrapper').style.display = '';
  if (body.parentNode && body.parentNode.style) {
    body.parentNode.style.backgroundColor = '#F5F7FC';
  }
}

const disableCommonStyles = () => {
  document.querySelector('#root').style.visibility = 'hidden';
  document.querySelector('.modal-window').style.visibility = 'hidden';
  document.querySelector('.scannerWrapper').style.display = 'block';
}

export const useCordovaQRScanner = () => {
  const checkPermission = useCallback(() => {
    if (window.QRScanner) {

      window.QRScanner.prepare(onDone); // show the prompt

      function onDone(err, status){
          if (err) {
              // here we can handle errors and clean up any loose ends.
              console.error(err);
          }
          if (status.authorized) {
              // W00t, you have camera access and the scanner is initialized.
              // QRscanner.show() should feel very fast.
          } else if (status.denied) {
              NotificationManager.error('QR code permission has been denied! You can not use QR Scanner', 'Error', 5000);
          // The video preview will remain black, and scanning is disabled. We can
          // try to ask the user to change their mind, but we'll have to send them
          // to their device settings with `QRScanner.openSettings()`.
          } else {
              NotificationManager.success('Didn`t get permission', 'Success', 5000);
              // we didn't get permission, but we didn't get permanently denied. (On
              // Android, a denial isn't permanent unless the user checks the "Don't
              // ask again" box.) We can ask again at the next relevant opportunity.
          }
      }
    }
  }, [window.QRScanner]);

  const handleClose = useCallback(() => {
    if (window.QRScanner) {
      enableCommonStyles();
      window.QRScanner.hide();
      window.QRScanner.cancelScan();
      window.QRScanner.destroy();
    }
  }, [window.QRScanner]);

  const getStatus = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.QRScanner) {
        window.QRScanner.getStatus(status => {
          resolve(status);
        })
      } else {
        reject();
      }
    })
  })

  const handleCamera = useCallback(() => {
    if (window.QRScanner) {
      const cameraHandler = {
        0: () => window.QRScanner.useFrontCamera(),
        1: () => window.QRScanner.useBackCamera(),
      }
      getStatus()
        .then(res => {
          cameraHandler[res.currentCamera]()
        })
    }
  }, [window.QRScanner, getStatus]);

  const handleLight = useCallback(() => {
    if (window.QRScanner) {
      getStatus().then((res) => {
        res.lightEnabled ? window.QRScanner.disableLight() : window.QRScanner.enableLight();
      })
    }
  }, [window.QRScanner, getStatus]);

  const handleScanStart = useCallback((onScanSuccess, onScanError) => {
    if (window.QRScanner) {
      window.QRScanner.scan((err, text) => {
          if(err){
              if (err.name === 'SCAN_CANCELED') return;
              NotificationManager.error('QR code reading has been failed!', 'Error', 5000);
              onScanError(err);
          } else {
            onScanSuccess(text);
          }
          handleClose();
      });

      window.QRScanner.show(() => {
        disableCommonStyles();
      });
    }
  }, [handleClose, window.QRScanner]);

  return {
    onCloseQRScanner: handleClose,
    onCheckPermissions: checkPermission,
    onCameraChange: handleCamera,
    onLightSwitch: handleLight,
    onScanStart: handleScanStart,
    getStatus,
  }
}