import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { useCordovaQRScanner } from 'hooks/useCordovaQRScanner';
import styles from './index.module.scss';

export const ScannerQR = () => {
  const [status, setStatus] = useState({});
  const { onCloseQRScanner, onLightSwitch, onCameraChange, getStatus } = useCordovaQRScanner();

  const handleStatusCheck = useCallback(() => {
    getStatus().then(setStatus);
  }, [getStatus]);

  const handleCamera = () => {
    onCameraChange();
    handleStatusCheck();
  }

  const handleLight = () => {
    onLightSwitch();
    handleStatusCheck();
  }

  useEffect(() => {
    handleStatusCheck();
  }, [handleStatusCheck])

  return (
    createPortal(
      <div className={classNames('scannerWrapper', styles.scannerWrapper)}>
        <div className={classNames(styles.scannerButton, styles.scannerClose)} onClick={onCloseQRScanner}>
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        <div className={styles.actionButtons}>
          <div
            className={classNames(styles.scannerButton, {[styles.scannerButtonActive]: status.currentCamera === 1} )}
            onClick={handleCamera}
          >
            <i class="fa fa-camera" aria-hidden="true"></i>
          </div>
          {status.canEnableLight && (
            <div
              className={classNames(styles.scannerButton, {[styles.scannerButtonActive]: status.lightEnabled } )}
              onClick={handleLight}
            >
              <i class="fa fa-bolt" aria-hidden="true"></i>
            </div>
          )}
        </div>
      </div>,
      document.body,
    )
  )
};