import React from 'react';
import {NotificationManager} from 'react-notifications';
import {connect} from 'react-redux';
import InputForm from '../input-form';
import {ONE_APL} from '../../../constants';
import {calculateFeeAction} from "../../../actions/forms";

class FeeCalc extends React.Component {

    calculateFee = async () => {
        const {setValue, values, requestType} = this.props;

        delete values.secretPhrase;
        delete values.passphrase;

        const requestParams = {
            ...values,
            requestType: requestType,
            deadline: '1440',
            publicKey: this.props.publicKey,
            feeATM: 0,
            calculateFee: true,
        };

        const fee = await calculateFeeAction(requestParams, requestType);

        if (!fee.errorCode) {
            setValue("feeATM", fee.transactionJSON.feeATM / ONE_APL);
        } else {
            NotificationManager.error(fee.errorDescription, 'Error', 5000);
        }
    };

    render() {
        const {setValue, defaultValue} = this.props;

        return (
            <div className="form-group mb-15">
                <label>
                    Fee
                </label>
                <div className="input-group input-group-sm">
                    <InputForm
                        field="feeATM"
                        placeholder="Minimum fee"
                        type={"float"}
                        setValue={setValue}
                        defaultValue={defaultValue || '1'}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">
                            Apollo
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    publicKey: state.account.publicKey
});

export default connect(mapStateToProps)(FeeCalc)
