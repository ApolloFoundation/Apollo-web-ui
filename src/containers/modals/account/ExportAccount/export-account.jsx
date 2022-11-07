/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useRef, useState } from 'react';
import {useDispatch} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import util from "../../../../helpers/util/utils";
import {exportAccount} from '../../../../actions/account';
import InfoBox from '../../../components/info-box';
import ModalBody from "../../../components/modals/modal-body";
import { ExportAccountForm } from './Form';
import { AccountKeySeedData } from './AccountKeySeedData';
import { useDownloadFile } from './useDownloadFIle';

const ExportAccount = (props) => {
    const dispatch = useDispatch();
    const downloadSecretFile = useRef();
    const [accountKeySeedData, setAccountKeySeedData] = useState(null);
    const downloadFile = useDownloadFile(accountKeySeedData);

    const finish = useCallback(async (base64, account) => {
        downloadSecretFile.current.href = encodeURI(base64);
        setAccountKeySeedData(prevState => ({
            ...prevState,
            href: downloadSecretFile.current.href
        }));
        if (util.isDesktopApp() && window.java) {
            window.java.downloadFile(accountKeySeedData.file, `${account}.apl`);
        } else {
            downloadSecretFile.current.click();
        }
    }, [downloadSecretFile.current]);

    const handleFormSubmit = useCallback(async (values) => {
        const accountKeySeedData = await dispatch(exportAccount(values));

        if (accountKeySeedData) {
            if (!accountKeySeedData.errorCode && accountKeySeedData.file) {
                const base64 = `data:application/octet-stream;base64,${accountKeySeedData.file}`;
                setAccountKeySeedData({
                    accountKeySeedData,
                    account: values.account,
                });
                finish(base64, values.account);
            } else {
                NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
            }
        }
    }, [dispatch, downloadSecretFile.current]);

    return (
        <ModalBody
            modalTitle='Export Account'
            closeModal={props.closeModal}
            handleFormSubmit={handleFormSubmit}
            isDisableSecretPhrase
            submitButtonName={!accountKeySeedData && 'Export'}
        >
            <InfoBox className={'light-info'}>
                <ul className={'marked-list'}>
                    <li className={'danger-icon'}>
                        <strong>Attention!</strong><br/>
                        Please, check your wallets to make sure there are no funds on them. Deleting a key from the
                        node may lead to the loss of all funds.
                    </li>
                </ul>
            </InfoBox>

            <ExportAccountForm />

            <AccountKeySeedData
                accountKeySeedData={accountKeySeedData}
                downloadFile={downloadFile}
                ref={downloadSecretFile}
                closeModal={props.closeModal}
            />
        </ModalBody>
    );
}

export default ExportAccount;