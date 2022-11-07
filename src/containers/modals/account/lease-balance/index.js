/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {NotificationManager} from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import LeaseBalanceForm from './lease-balance-form';

const  LeaseBalance = (props) => {
    const handleFormSubmit = useCallback(async (values) => {
        props.processForm(values, 'leaseBalance', 'Product has been listed!', () => {
            props.closeModal();
            NotificationManager.success('Lease has been submitted!', null, 5000);
		});
    }, [props.processForm, props.closeModal]);

    return (
        <ModalBody
            modalTitle='Lease Your Balance'
            isAdvanced
            isFee
            closeModal={props.closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Lease your balance'
            idGroup='lease-balance-modal-'
            initialValues={{ period: 0 }}
        >
            <LeaseBalanceForm />
        </ModalBody>
    );
}

export default LeaseBalance;
