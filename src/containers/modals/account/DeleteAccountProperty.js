/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from "react-notifications";
import FeeCalc from 'containers/components/form-components/FeeCalc';
import { getModalDataSelector } from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';

const DeleteAccountProperty = (props) => {
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(async (values) => {
        const res = await props.processForm({
            ...values,
            ...modalData,
        }, 'deleteAccountProperty');
        if (res && !res.errorCode) {
            props.closeModal();
            NotificationManager.success('Account property has been deleted!', null, 5000);
        }
    }, [modalData, props.closeModal, props.processForm]);

    return (
        <ModalBody
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            initialValues={{ feeATM: 1 }}
            submitButtonName='Delete Property'
            modalTitle="Delete Account Property"
            closeModal={props.closeModal}
        >
                <div className="form-group mb-15">
                    <label>
                        Setter
                    </label>
                    <div>
                        <span>
                            {modalData?.setterRS ?? '-'}
                        </span>
                    </div>
                </div>
                <div className="form-group mb-15">
                    <label>
                        Recipient
                    </label>
                    <div>
                        <span>
                            {modalData?.recipientRS ?? '-'}
                        </span>
                    </div>
                </div>
                <div className="form-group mb-15">
                    <label>
                        Property
                    </label>
                    <div>
                        <span>
                            {modalData?.property ?? '-'}
                        </span>
                    </div>
                </div>
                <FeeCalc requestType='setAccountInfo' />
        </ModalBody>
    );
}

export default DeleteAccountProperty;
