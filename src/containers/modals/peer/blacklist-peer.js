/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import BackForm from '../modal-form/modal-form-container';
import InfoBox from '../../components/info-box';
import { ModalBackButton } from '../../components/ModalBackButton';
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import { ButtonsBlock } from '../../components/ButtonsBlock';
import { getModalDataSelector, getAccountPublicKeySelector } from '../../../selectors';

const BlacklistPeer = (props) => {
    const modalData = useSelector(getModalDataSelector);
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
            <div className="modal-box">
                <BackForm
                    nameModal={props.nameModal}
                    onSubmit={handleFormSubmit}
                >
                    <div className="form-group-app">
                        <button type="button" onClick={props.closeModal} className="exit">
                            <i className="zmdi zmdi-close"/>
                        </button>

                        <div className="form-title">
                            <ModalBackButton />
                            <p>Blacklist Peer</p>
                        </div>

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
                        <ButtonsBlock
                            cancelMessage="No"
                            cancelAction={props.closeModal}
                            submitMessage="Yes"
                            isPending={isPending}
                        />
                    </div>
                </BackForm>
            </div>
        );
}

export default BlacklistPeer;
