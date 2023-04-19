import React from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import styles from './index.module.scss';

export const ScannerQR = () => {

  const handleClose = () => {
    if (window.QRScanner) {
      document.querySelector('body').style.backgroundColor = '#F5F7FC';
      document.querySelector('#root').style.visibility = '';
      // document.querySelector('html').style.height = '';
      document.querySelector('.modal-window').style.visibility = '';
      document.querySelector('.scannerWrapper').style.display = '';
      window.QRScanner.hide();
      window.QRScanner.cancelScan();
    }
  }

  const handleCamera = () => {
    if (window.QRScanner) {
      const cameraHandler = {
        0: () => window.QRScanner.useFrontCamera(),
        1: () => window.QRScanner.useBackCamera(),
      }
      window
        .QRScanner
          .getStatus((status) => {
            cameraHandler[status.currentCamera]();
          });
    }
  }

  const handleLight = () => {
    if (window.QRScanner) {
      window
        .QRScanner
          .getStatus(({ lightEnabled }) => {
            lightEnabled ? window.QRScanner.disableLight() : window.QRScanner.enableLight();
          });
    }
  }

  return (
    createPortal(
      <div className={classNames('scannerWrapper', styles.scannerWrapper)}>
        <div className={classNames(styles.scannerClose, styles.scannerButton)} onClick={handleClose}>&times;</div>
        <div className={styles.actionButtons}>
          <div className={styles.scannerButton} onClick={handleCamera}><i class="fa fa-camera" aria-hidden="true"></i></div>
          <div className={styles.scannerButton} onClick={handleLight}><i class="fa fa-lightbulb-o" aria-hidden="true"></i></div>
        </div>
      </div>,
      document.body,
    )
  )
};