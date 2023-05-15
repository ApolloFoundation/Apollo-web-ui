import React, { useEffect } from "react";
import { useCordovaQRScanner } from "hooks/useCordovaQRScanner";

export const ScannerComponents = (props) => {
    const { onScanStart, onCheckPermissions } = useCordovaQRScanner();

    const handleClick = () => {
        onScanStart(props.onScan);
    }

    useEffect(() => {
        onCheckPermissions();
    }, [onCheckPermissions])

    if (!window.cordova) return null

    return <i class="fa fa-qrcode" aria-hidden="true" onClick={handleClick}></i>
}