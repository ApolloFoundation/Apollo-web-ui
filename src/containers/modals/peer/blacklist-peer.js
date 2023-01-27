/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import InfoBox from 'containers/components/info-box';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import { getModalDataSelector, getAccountPublicKeySelector } from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';

const BlacklistPeer = (props) => {
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const publicKey = useSelector(getAccountPublicKeySelector);
    const [isPending, setIsPending] = useState(false);

    const handleFormSubmit = useCallback(async (values) => {
        if (!isPending) {
            setIsPending(true);
            const toSend = {
                adminPassword: values.adminPass,
                peer: modalData,
                publicKey,
                ecBlockHeight: 0
            };

            await props.processForm(toSend, 'blacklistPeer', 'Peer has been blacklisted', () => {
                NotificationManager.success('Peer has been blacklisted!', null, 5000);
                props.closeModal();
            });
            setIsPending(false);
        }
    }, [isPending, modalData, props.closeModal, props.processForm]);

    return (
        <ModalBody
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            modalTitle="Blacklist Peer"
            closeModal={props.closeModal}
            submitButtonName="Yes"
            cancelButtonName="No"
            isDisableSecretPhrase
            isPending={isPending}
        >
            <InfoBox className='light-info'>
                <ul className='marked-list'>
                    <li className='danger-icon'>
                        <strong>Attention!</strong><br/>
                        Are you sure you want to blacklist this peer?
                    </li>
                </ul>
            </InfoBox>

            <div className="form-group mb-15">
                <label>
                    Name:
                </label>
                <div>
                    <span>{modalData}</span>
                </div>
            </div>
            <div className="form-group mb-15">
                <CustomInput
                    label="Admin Password"
                    name="adminPass"
                    type="password"
                />
            </div>
        </ModalBody>
    );
}

export default BlacklistPeer;
