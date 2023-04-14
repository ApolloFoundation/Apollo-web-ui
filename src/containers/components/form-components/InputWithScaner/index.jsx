import React from "react";
import { useFormikContext } from "formik";
import { NotificationManager } from "react-notifications";
import { AccountRSWithFormik } from "containers/components/account-rs/AccountRSWithFormik";
import qr from './qr-code.png';

export const InputWithScaner = (props) => {
    const formik = useFormikContext();
    const handleClick = () => {
        if (window.QRScanner) {
            window.QRScanner.scan((err, text) => {
                if(err){
                    NotificationManager.error('QR code reading has been failed!', 'Error', 5000);
                } else {
                    formik.setFieldValue(props.name, text);
                }
            });
            window.QRScanner.show();
        }
    }

    return (
        <AccountRSWithFormik
            {...props}
            qrElement={<img  src={qr} onClick={handleClick} />}
        />
    )
}