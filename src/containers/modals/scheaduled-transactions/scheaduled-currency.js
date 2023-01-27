import React, { useCallback } from 'react';
import { useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../components/modals/modal-body';
import { getAdminPasswordSelector, getModalDataSelector } from '../../../selectors';
import { Form } from './Form';

const ScheaduleCurrency = ({ processForm, closeModal }) => {
    const adminPassword = useSelector(getAdminPasswordSelector);
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback(({currencyDecimals, ...values}) => {
        const data = {
            ...values,
            broadcast: false,
            adminPassword,
            units: values.units * Math.pow(10, currencyDecimals)
        };

        processForm(data, 'scheduleCurrencyBuy', 'Schedule currency has been submitted.', () => {
            NotificationManager.success('Schedule currency has been submitted.', null, 5000);
                modalData()
                closeModal();
        })
    }, [modalData, closeModal, processForm]);

    return (
        <ModalBody
            modalTitle='Schedule Currency'
            closeModal={closeModal}
            submitButtonName="Schedule currency"
            handleFormSubmit={handleFormSubmit}
        >
            <Form />
        </ModalBody>
    );
}

export default ScheaduleCurrency;
