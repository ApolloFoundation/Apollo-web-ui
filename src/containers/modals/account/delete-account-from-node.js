/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useSelector} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {removeAccountAction} from '../../../actions/account';
import InfoBox from '../../components/info-box';
import ModalBody from "../../components/modals/modal-body";
import AccountRSFormInput from "../../components/form-components/account-rs1";
import { useDownloadFile } from './ExportAccount/useDownloadFIle';
import { getModalDataSelector } from 'selectors';
import CustomInput from 'containers/components/custom-input';

const DeleteAccountFromWebNode = (props) => {
    const modalData = useSelector(getModalDataSelector);
    const downloadFile = useDownloadFile(modalData);

    const handleFormSubmit = useCallback(async (values) => {
        const accountKeySeedData = await removeAccountAction(values);

        if (accountKeySeedData && !accountKeySeedData.errorCode) {
            NotificationManager.success('Your account was successfully removed from this web node.', null, 5000);
            props.closeModal();

        } else {
            NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
        }
    }, [props.closeModal]);

    return (
        <ModalBody
            modalTitle="Delete Account from this Web Node"
            closeModal={props.closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Delete'
        >
            <InfoBox attentionLeft>
                <p className='mb-3'>
                    Account ID: <span className='itatic'>{modalData[0].value}</span>
                </p>
                <a
                    href={modalData[1].value.href}
                    download={`${modalData[0].value}.apl`}
                    className="btn btn-green"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={downloadFile}
                >
                    Download Secret File
                </a>
            </InfoBox>
            <InfoBox className='light-info'>
                <ul className='marked-list'>
                    <li className='danger-icon'>
                        <strong>Attention!</strong><br/>
                        Make a backup of your secret file. You will lose access to your account and funds if
                        you do not have a backup.
                    </li>
                </ul>
            </InfoBox>
            <AccountRSFormInput
                name='account'
                label='Account ID'
                placeholder='Account ID'
            />
            <CustomInput
                label='Secret phrase'
                // special value from request
                name="passphrase"
                placeholder="Secret phrase"
                type="password"
            />
        </ModalBody>
    );
}

export default DeleteAccountFromWebNode;
