import React, { useCallback } from 'react';
import BackForm from "../modal-form/modal-form-container";
import { useDispatch, useSelector } from 'react-redux';
import submitForm from '../../../helpers/forms/forms';
import { ModalBackButton } from '../../components/ModalBackButton';
import CustomInput from '../../components/custom-input';
import { getModalDataSelector } from '../../../selectors';

const AddMonitoredAccount = (props) =>  {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector);

    const handleFormSubmit = useCallback(async (data) => {
        const values = {
            ...data,
            property: modalData.property ? modalData.property : ''
        }

        dispatch(submitForm.submitForm(values, 'setAccountProperty'))
            .then(props.closeModal)
    }, [props.closeModal, dispatch, modalData.property])


    return (
        <div className="modal-box">
            <BackForm
                nameModal={props.nameModal}
                onSubmit={handleFormSubmit}
            >
                <div className="form-group-app">
                    <button type="button" onClick={props.closeModal} className="exit">
                        <i className="zmdi zmdi-close" />
                    </button>

                    <div className="form-title">
                        <ModalBackButton />
                        <p>Start Funding Monitor</p>
                    </div>

                    <div className="input-group-app offset-top display-block inline">
                        <div className="row">
                            <div className="col-md-3">
                                <label>Property</label>
                            </div>
                            <div className="col-md-9">
                                <div className="input-wrapper">
                                    {modalData.property ? modalData.property : '?'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Recipient"
                            name="recipient"
                            placeholder='Recipient Account'
                        />
                    </div>
                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Amount"
                            name="amount"
                            placeholder='Amount'
                        />
                    </div>
                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Threshold"
                            name="threshold"
                            placeholder='Threshold'
                        />
                    </div>
                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Interval"
                            name="interval"
                            placeholder='Interval'
                        />
                    </div>
                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Fee"
                            name="feeATM"
                            placeholder='Amount'
                        />
                    </div>
                    <div className="input-group-app offset-top display-block inline">
                        <CustomInput
                            label="Secret Phrase"
                            name="secretPhrase"
                            placeholder='Secret Phrase'
                        />
                    </div>
                    <div className="btn-box right-conner align-right form-footer">
                        <button
                            type='button'
                            onClick={props.closeModal}
                            className="btn round round-top-left"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            name='closeModal'
                            className="btn btn-right blue round round-bottom-right"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </BackForm>
        </div>
    );
}

export default AddMonitoredAccount;