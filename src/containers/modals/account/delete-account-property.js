/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from "classnames";
import { setBodyModalParamsAction } from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";
import { NotificationManager } from "react-notifications";
import ModalFooter from '../../components/modal-footer/index1';
import FeeCalc from '../../components/form-components/fee-calc1';
import BackForm from '../modal-form/modal-form-container';
import { getModalDataSelector } from '../../../selectors';
import { ModalBackButton } from '../../components/ModalBackButton';

const DeleteAccountProperty = (props) => {
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);
    const modalData = useSelector(getModalDataSelector);

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
                dispatch(setBodyModalParamsAction(null, {}));
                NotificationManager.success('Account property has been deleted!', null, 5000);
            }
            setIsPending(false);
        }
    }, [dispatch, isPending, modalData]);

    return (
        <div className="modal-box">
            <BackForm
                nameModal={props.nameModal}
                onSubmit={handleFormSubmit}
                initialValues={{ feeATM: 1 }}
            >
                <div className="form-group-app">
                    <button type="button" onClick={props.closeModal} className="exit">
                        <i className="zmdi zmdi-close"/>
                    </button>
                    <div className="form-title">
                        <ModalBackButton />
                        <p>Delete Account Property</p>
                    </div>
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
                    <FeeCalc requestType={'setAccountInfo'} />
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
                                "loading btn-green-disabled": isPending,
                            })}
                        >
                            <div className="button-loader">
                                <div className="ball-pulse">
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>
                            <span className='button-text'>Delete Property</span>
                        </button>
                    </div>
                </div>
            </BackForm>
        </div>
    );
}

export default DeleteAccountProperty;
