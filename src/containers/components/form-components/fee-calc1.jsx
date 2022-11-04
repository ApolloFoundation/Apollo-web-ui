import React, { useEffect } from 'react';
import {NotificationManager} from 'react-notifications';
import {connect, useSelector} from 'react-redux';
import { useFormikContext } from 'formik';
import InputForm from '../custom-input';
import {calculateFeeAction} from "../../../actions/forms";
import { getAccountInfoSelector } from '../../../selectors';

const FeeCalc = ({ requestType, defaultValue }) => {
    const formik = useFormikContext();
    const { publicKey,decimals,ticker } = useSelector(getAccountInfoSelector);

    const calculateFee = async () => {
        console.log(formik)
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
    }, [])

    return (
        <div className="form-group mb-15">
            <div className="input-group">
                <InputForm
                    label='Fee'
                    name="feeATM"
                    placeholder="Minimum fee"
                    type="float"
                    // setValue={formik.setFieldValue}
                    defaultValue={defaultValue || '1'}
                />
                <div className="input-group-append">
                    <span className="input-group-text">
                        {ticker}
                    </span>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    publicKey: state.account.publicKey,
    decimals: state.account.decimals,
    ticker: state.account.ticker,
});

export default connect(mapStateToProps)(FeeCalc)
