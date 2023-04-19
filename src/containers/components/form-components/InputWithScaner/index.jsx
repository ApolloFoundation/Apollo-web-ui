import React from "react";
import { useFormikContext } from "formik";
import { NotificationManager } from "react-notifications";
import { AccountRSWithFormik } from "containers/components/account-rs/AccountRSWithFormik";
import qr from './qr-code.png';
import { useEffect } from "react";
import { useState } from "react";
import { ScannerQR } from "containers/components/scanner";

export const InputWithScaner = (props) => {
    const [state, setState ] = useState({});
    const [st, setSt] = useState('');
    const [st2, setSt2] = useState('');
    const formik = useFormikContext();
    const handleClick = () => {
        if (window.QRScanner) {
            window.QRScanner.scan((err, text) => {
                if(err){
                    NotificationManager.error('QR code reading has been failed!', 'Error', 5000);
                } else {
                    formik.setFieldValue(props.name, text);
                }
                document.querySelector('body').style.backgroundColor = '#F5F7FC';
                document.querySelector('#root').style.visibility = '';
                // document.querySelector('html').style.height = '';
                document.querySelector('.modal-window').style.visibility = '';
                document.querySelector('.scannerWrapper').style.display = '';
                window.QRScanner.hide();
                window.QRScanner.cancelScan();
            });

            window.QRScanner.show(function(status){
                NotificationManager.success('scan show', 'Success', 5000);
                // let str = ''
                // for (let i in status) {
                //     str = `${i} -> ${status[i]}/n`
                // }
                // setSt(str)
                // document.querySelector('html').style.background = 'transparent';
                document.querySelector('#root').style.visibility = 'hidden';
                document.querySelector('.modal-window').style.visibility = 'hidden';
                document.querySelector('.scannerWrapper').style.display = 'block';
                // document.querySelector('html').style.height = '0';

                // window.QRScanner.getStatus(function(status){
                //     let str = ''
                //     for (let i in status) {
                //         str = `${i} -> ${status[i]}/n`
                //     }
                //     setSt2(str)
                // });

              });
        }
    }

    useEffect(() => {
        if (window.QRScanner) {

            window.QRScanner.prepare(onDone); // show the prompt
    
            function onDone(err, status){
                if (err) {
                    NotificationManager.error('QR code reading has been failed!', 'Error', 5000);
    
                // here we can handle errors and clean up any loose ends.
                console.error(err);
                }
                if (status.authorized) {
                    NotificationManager.success('Ok', 'Success', 5000);
    
                    // W00t, you have camera access and the scanner is initialized.
                    // QRscanner.show() should feel very fast.
                } else if (status.denied) {
                    NotificationManager.error('QR code reading has been failed!', 'Error', 5000);
    
                // The video preview will remain black, and scanning is disabled. We can
                // try to ask the user to change their mind, but we'll have to send them
                // to their device settings with `QRScanner.openSettings()`.
                } else {
                    NotificationManager.success('Didnt get permission', 'Success', 5000);
                    // we didn't get permission, but we didn't get permanently denied. (On
                    // Android, a denial isn't permanent unless the user checks the "Don't
                    // ask again" box.) We can ask again at the next relevant opportunity.
                }
            }
        }
    }, [])

    return (
        <>
        {st}
        {st2}
        {/* {state.showing &&  <ScannerQR /> } */}
        <AccountRSWithFormik
            {...props}
            qrElement={<img  src={qr} onClick={handleClick} />}
        />
        </>
    )
}