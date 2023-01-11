/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import classNames from "classnames";
import {NotificationManager} from "react-notifications";
import {openPrevModal, setBodyModalParamsAction} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";
import ModalFooter from '../../components/modal-footer';
import BackForm from '../modal-form/modal-form-container';
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import CustomTextArea from '../../components/form-components/TextArea/TextAreaWithFormik';
import { getAccountInfoSelector, getModalHistorySelector } from '../../../selectors';
import { FeeWrapper } from '../../components/form-components/FeeWrapper';

const  AccountInfo = (props) => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        isPending: false,
    });

    const accountInfo = useSelector(getAccountInfoSelector);
    const modalsHistory = useSelector(getModalHistorySelector);

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

    const handleOpenPrevModal = () => dispatch(openPrevModal());

    return (
        <div className="modal-box">
            <BackForm
                nameModal={props.nameModal}
                onSubmit={handleFormSubmit}
                initialValues={{ 
                    feeATM: 1,
                    isCustomFee: true,
                    name: accountInfo.name,
                    description: accountInfo.description
                }}
            >
                <div className="form-group-app">
                    <button type="button" onClick={props.closeModal} className="exit">
                        <i className="zmdi zmdi-close"/>
                    </button>
                    <div className="form-title">
                        {modalsHistory.length > 1 && (
                            <div className="backMy" onClick={handleOpenPrevModal}></div>
                        )}
                        <p>Set Account Info</p>
                    </div>
                    <div className="form-group mb-15">
                        <CustomInput
                            label="Name"
                            placeholder="Your name"
                            name="name"
                        />
                    </div>
                    <div className="form-group mb-15">
                        <CustomTextArea
                            label="Description"
                            placeholder="Description"
                            name="message"
                            cols="6"
                            rows="10"
                        />
                    </div>
                    <FeeWrapper name='feeATM' />

                    <ModalFooter />

                    <div className="btn-box right-conner align-right form-footer">
                        <button
                            type='button'
                            onClick={props.closeModal}
                            className="btn btn-default mr-3"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            name='closeModal'
                            className={classNames("btn btn-green submit-button", {
                                "loading btn-green-disabled": state.isPending,
                            })}
                        >
                            <div className="button-loader">
                                <div className="ball-pulse">
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>
                            <span className='button-text'>Update Account Info</span>
                        </button>
                    </div>
                </div>
            </BackForm>
        </div>
    );
}

export default AccountInfo;
