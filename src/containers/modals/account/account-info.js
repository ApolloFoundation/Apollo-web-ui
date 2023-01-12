/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {setBodyModalParamsAction} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import CustomTextArea from '../../components/form-components/TextArea/TextAreaWithFormik';
import { getAccountInfoSelector } from '../../../selectors';
import { FeeWrapper } from '../../components/form-components/FeeWrapper';
import ModalBody from '../../components/modals/modal-body';

const  AccountInfo = (props) => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        isPending: false,
    });

    const accountInfo = useSelector(getAccountInfoSelector);

    const handleFormSubmit = useCallback(async (values) => {
        if (!state.isPending) {
            setState({ isPending: true });

            const res = await dispatch(submitForm.submitForm({ ...values }, 'setAccountInfo'));

            if (res && res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                dispatch(setBodyModalParamsAction(null, {}));
                NotificationManager.success('Account info has been submitted!', null, 5000);
            }
            setState({ isPending: false });
        }
    }, [dispatch, state.isPending]);

    return (
        <ModalBody
            modalTitle="Set Account Info"
            submitButtonName="Update Account Info"
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            initialValues={{ 
                feeATM: 1,
                isCustomFee: false,
                name: accountInfo.name,
                description: accountInfo.description,
            }}
            closeModal={props.closeModal}
            isPending={state.isPending}
        >
            <CustomInput
                label="Name"
                placeholder="Your name"
                name="name"
            />
            <CustomTextArea
                label="Description"
                placeholder="Description"
                name="message"
                cols="6"
                rows="10"
            />
            <FeeWrapper name='feeATM' />
        </ModalBody>
    );
}

export default AccountInfo;
