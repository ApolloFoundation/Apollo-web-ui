import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import InputForm from 'containers/components/custom-input/CustomInputWithFormik';
import { calculateFeeAction } from "actions/forms";
import {
    getAccountPublicKeySelector,
    getDecimalsSelector,
    getTickerSelector
} from 'selectors';

const FeeCalc = ({ requestType }) => {
    const formik = useFormikContext();
    const publicKey = useSelector(getAccountPublicKeySelector);
    const decimals = useSelector(getDecimalsSelector);
    const ticker = useSelector(getTickerSelector);

    const calculateFee = async () => {
        const { secretPhrase, passphrase, ...values } = formik.values;

        const requestParams = {
            ...values,
            requestType,
            deadline: '1440',
            publicKey,
            feeATM: 0,
            calculateFee: true,
        };

        const fee = await calculateFeeAction(requestParams, requestType);

        if (!fee.errorCode) {
            formik.setFieldValue("feeATM", fee.transactionJSON.feeATM / decimals);
        } else {
            NotificationManager.error(fee.errorDescription, 'Error', 5000);
        }
    };

    useEffect(() => {
        calculateFee();
    }, []);

    return (
        <InputForm
            label='Fee'
            name="feeATM"
            placeholder="Minimum fee"
            type="float"
        >
            <div className="input-group-append">
                <span className="input-group-text">
                    {ticker}
                </span>
            </div>
        </InputForm>
    );
}

export default FeeCalc;
