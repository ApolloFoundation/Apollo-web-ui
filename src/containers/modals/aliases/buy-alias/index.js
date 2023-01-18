/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import TextualInputComponent from '../../../components/form-components/TextualInput';
import ModalBody from '../../../components/modals/modal-body';
import { getDecimalsSelector, getModalDataSelector, getTickerSelector } from '../../../../selectors';

const GetAlias = ({ processForm, closeModal }) => {
    const ticker = useSelector(getTickerSelector);
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const decimals = useSelector(getDecimalsSelector);

    const handleFormSubmit = useCallback(async (values) => {
        const {alias, aliasName, secretPhrase, priceATM, feeATM} = values;
        let isError = false;
        if (!feeATM) {
            NotificationManager.error('Enter fee!', null, 5000);
            isError = true;
        }

        if (!secretPhrase) {
            NotificationManager.error('Enter secretPhrase!', null, 5000);
            isError = true;
        }

        if (isError) return

        const boughtAlias = {
            alias,
            aliasName,
            secretPhrase,
            amountATM: priceATM,
            feeATM: feeATM,
        }

        processForm(boughtAlias, 'buyAlias', 'Alias has been bought!', () => {
            closeModal();
            NotificationManager.success('Alias has been bought!', null, 5000);
        });
    }, [processForm, closeModal])

    return (
        <ModalBody
            modalTitle='Buy Alias'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Buy Alias'
            initialValues={{
                aliasName: modalData.aliasName,
                priceATM: modalData.priceATM / decimals,
            }}
        >
            <TextualInputComponent
                label='Alias'
                disabled
                name="aliasName"
                placeholder="Alias"
                type="text"
            />
            <TextualInputComponent
                label='Price'
                countLabel={ticker}
                disabled
                name="priceATM"
                placeholder="Amount"
                type="float"
            />
        </ModalBody>
    );
}

export default GetAlias;
