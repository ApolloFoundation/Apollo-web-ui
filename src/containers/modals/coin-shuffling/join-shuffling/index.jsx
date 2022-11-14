/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getBlockAction} from "../../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import {getShufflingAction} from "../../../../actions/shuffling";
import crypto from "../../../../helpers/crypto/crypto";
import {processElGamalEncryption} from "../../../../actions/crypto";
import ModalBody from "../../../components/modals/modal-body";
import { getModalDataSelector } from '../../../../selectors';
import JoinShufflingForm from "./form";

const JoinShuffling = ({ closeModal }) => {
    const dispatch = useDispatch();
    const [shuffling, setShuffling] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback(async(values) => {
        setIsPending(true);
        const data = {
            shufflingFullHash: modalData?.broadcast?.fullHash ?? shuffling?.shufflingFullHash,
            secretPhrase: values.secretPhrase,
            createNoneTransactionMethod: true,
            code2FA: values.code2FA,
            feeATM: values.feeATM,
        };

        if (values.isVaultWallet) {
            data.recipientPublicKey = values.publicKey;
        } else {
            data.recipientSecretPhrase = await processElGamalEncryption(values.recipientSecretPhrase);
            data.recipientPublicKey = await crypto.getPublicKeyAPL(values.recipientSecretPhrase, false);
        }

        const res = await dispatch(submitForm.submitForm(data, 'startShuffler'));
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000);
            setIsPending(false);
        } else {
            closeModal();
            NotificationManager.success('Shuffling Started!', null, 5000);
        }
    }, [closeModal, modalData?.broadcast?.fullHash, shuffling?.shufflingFullHash]);

    const getShuffling = async () => {
        const shuffling = await dispatch(getShufflingAction({
            shuffling: modalData,
        }));

        if (shuffling) {
            setShuffling(shuffling);
        }
    };

    const setRegisterUntil = () => {
        dispatch(getBlockAction());
    };

    useEffect(() => {
        setRegisterUntil();
        getShuffling();
        NotificationManager.warning('Your secret phrase will be sent to the server!', 'Warning', 30000);
        NotificationManager.warning('Use the recipient\'s strong secret phrase and do not forget it!', 'Warning', 30000);
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', 'Attention', 30000);
    }, []);

    return (
        <ModalBody
            modalTitle='Start shuffling'
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            isFee
            submitButtonName='Start Shuffling'
            idGroup='send-money-modal-'
            isPending={isPending}
            initialValues={{
                isVaultWallet: false,
                recipientSecretPhrase: '',
            }}
        >
            <JoinShufflingForm shuffling={shuffling} />
        </ModalBody>
    );
}


export default JoinShuffling;
