import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import submitForm from '../../../helpers/forms/forms';
import CustomInput from '../../components/custom-input/CustomInputWithFormik';
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/TextualInput';
import { getModalDataSelector, getTickerSelector } from '../../../selectors';

const AddMonitoredAccount = (props) =>  {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    const ticker = useSelector(getTickerSelector);
    const [isPending, setIsPending] = useState();

    const handleFormSubmit = useCallback(async (data) => {
        setIsPending(true);
        const values = {
            ...data,
            property: modalData?.property ?? ''
        }

        dispatch(submitForm.submitForm(values, 'setAccountProperty'))
            .then(props.closeModal)
            .finally(() => {
                setIsPending(false);
            })
    }, [props.closeModal, dispatch, modalData.property])


    return (
        <ModalBody
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            modalTitle="Start Funding Monitor"
            submitButtonName="Add"
            closeModal={props.closeModal}
            isPending={isPending}
        >
            <div className="input-group-app offset-top display-block inline mb-2">
                <div className="row">
                    <div className="col-md-3">
                        <label>Property</label>
                    </div>
                    <div className="col-md-9">
                        <div className="input-wrapper">
                            {modalData?.property ?? '?'}
                        </div>
                    </div>
                </div>
            </div>
            <CustomInput
                label="Recipient"
                name="recipient"
                placeholder='Recipient Account'
            />
            <CustomInput
                label="Amount"
                name="amount"
                placeholder='Amount'
            />
            <CustomInput
                label="Threshold"
                name="threshold"
                placeholder='Threshold'
            />
            <CustomInput
                label="Interval"
                name="interval"
                placeholder='Interval'
            />
            <TextualInputComponent
                label="Fee"
                name="feeATM"
                placeholder='Amount'
                code={ticker}
                type="float"
            />
        </ModalBody>
    );
}

export default AddMonitoredAccount;