import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { useCordovaQRScanner } from 'hooks/useCordovaQRScanner';
import styles from './index.module.scss';

export const ScannerQR = () => {
  const { onCloseQRScanner, onLightSwitch, onCameraChange, getStatus } = useCordovaQRScanner();
  const [isLightAvaliable, setIsLightAvailable] = useState(false);

  useEffect(() => {
    getStatus().then((res) => {
      setIsLightAvailable(res.canEnableLight);
    })
  }, [getStatus])

  return (
    createPortal(
      <div className={classNames('scannerWrapper', styles.scannerWrapper)}>
        <div className={classNames(styles.scannerButton, styles.scannerClose)} onClick={onCloseQRScanner}>
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        <div className={styles.actionButtons}>
          <div className={styles.scannerButton} onClick={onCameraChange}><i class="fa fa-camera" aria-hidden="true"></i></div>
          {isLightAvaliable && (
            <div className={styles.scannerButton} onClick={onLightSwitch}><i class="fa fa-bolt" aria-hidden="true"></i></div>
          )}
        </div>
      </div>,
      document.body,
    )
  )
};