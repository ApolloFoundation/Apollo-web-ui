/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from "react-notifications";
import submitForm from "helpers/forms/forms";
import FeeCalc from 'containers/components/form-components/FeeCalc';
import { getModalDataSelector } from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';

const DeleteAccountProperty = (props) => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleFormSubmit = useCallback(async (values) => {
        if (!isPending) {
            setIsPending(true);
            const res = await dispatch(submitForm.submitForm({
                ...values,
                ...modalData,
            }, 'deleteAccountProperty')) 
            if (res && res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                props.closeModal();
                NotificationManager.success('Account property has been deleted!', null, 5000);
            }
            setIsPending(false);
        }
    }, [dispatch, isPending, modalData, props.closeModal]);

    return (
        <ModalBody
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            initialValues={{ feeATM: 1 }}
            submitButtonName='Delete Property'
            modalTitle="Delete Account Property"
            closeModal={props.closeModal}
            isPending={isPending}
        >
                <div className="form-group mb-15">
                    <label>
                        Setter
                    </label>
                    <div>
                        <span>
                            {(modalData && modalData.setterRS) ? modalData.setterRS : '-'}
                        </span>
                    </div>
                </div>
                <div className="form-group mb-15">
                    <label>
                        Recipient
                    </label>
                    <div>
                        <span>
                            {(modalData && modalData.recipientRS) ? modalData.recipientRS : '-'}
                        </span>
                    </div>
                </div>
                <div className="form-group mb-15">
                    <label>
                        Property
                    </label>
                    <div>
                        <span>
                            {(modalData && modalData.property) ? modalData.property : '-'}
                        </span>
                    </div>
                </div>
                <FeeCalc requestType='setAccountInfo' />
        </ModalBody>
    );
}

export default DeleteAccountProperty;
