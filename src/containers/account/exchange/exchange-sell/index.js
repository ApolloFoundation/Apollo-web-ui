import React from 'react';
import {connect} from "react-redux";
import {Form} from "react-form";
import {NotificationManager} from "react-notifications";
import InputForm from '../../../components/input-form';
import {currencyTypes, formatDivision, multiply} from "../../../../helpers/format";
import {createOffer} from "../../../../actions/wallet";
import {setBodyModalParamsAction} from "../../../../modules/modals";

class ExchangeSell extends React.Component {
    feeATM = 200000000;
    state = {
        form: null,
    };

    handleFormSubmit = (values) => {
        if (this.props.wallet) {
            if (values.offerAmount > 0 && values.pairRate > 0) {
                const pairRate = multiply(values.pairRate, 100000000);
                const offerAmount = multiply(values.offerAmount, 100000000);
                const balanceAPL = parseFloat(this.props.balanceAPL);

                if (!this.props.balanceAPL || balanceAPL === 0 || balanceAPL < (offerAmount + this.feeATM)) {
                    NotificationManager.error('Not enough founds on your APL balance.', 'Error', 5000);
                    return;
                }

                const params = {
                    offerType: 1, // SELL
                    pairCurrency: currencyTypes[this.props.currentCurrency.currency],
                    pairRate,
                    offerAmount,
                    offerCurrency: currencyTypes['apl'],
                    sender: this.props.account,
                    passphrase: this.props.passPhrase,
                    feeATM: this.feeATM
                };

                if (this.props.passPhrase) {
                    this.props.createOffer(params);
                    if (this.state.form) this.state.form.resetAll();
                } else {
                    this.props.setBodyModalParamsAction('CONFIRM_CREATE_OFFER', {
                        params,
                        resetForm: this.state.form.resetAll
                    });
                }
            } else {
                NotificationManager.error('Price and amount are required fields', 'Error', 5000);
            }
        } else {
            this.props.handleLoginModal();
        }
    };

    getFormApi = (form) => {
        this.setState({form})
    };

    render() {
        const {currentCurrency: {currency}, wallet, balanceAPL} = this.props;
        const balanceFormat = balanceAPL ? formatDivision(balanceAPL, 100000000, 3) : 0;
        const currencyName = currency.toUpperCase();
        return (
            <div className={'card-block green card card-medium pt-0 h-400'}>
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    getApi={this.getFormApi}
                    render={({
                                 submitForm, setValue, values
                             }) => (
                        <form className="modal-form modal-send-apollo modal-form" onSubmit={submitForm}>
                            <div className="form-title d-flex justify-content-between align-items-center">
                                <p>Sell APL</p>
                                <span>Fee: {this.feeATM/100000000} APL</span>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    Price for 1 APL
                                </label>
                                <div className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="pairRate"
                                        type={"float"}
                                        onChange={(price) => setValue("total", multiply(values.offerAmount, price))}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">{currencyName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    I want to Sell
                                </label>
                                <div
                                    className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="offerAmount"
                                        type={"float"}
                                        onChange={(amount) => setValue("total", multiply(amount, values.pairRate))}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">APL</span>
                                    </div>
                                    <small className={'text-note'}>Will be frozen on your balance during 24 hours.</small>
                                </div>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    I will receive
                                </label>
                                <div
                                    className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="total"
                                        type={"float"}
                                        setValue={setValue}
                                        disabled/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">{currencyName}</span>
                                    </div>
                                </div>
                            </div>
                            {wallet && wallet.wallets && balanceFormat !== false && (
                                <div className={'form-group-text d-flex justify-content-between'}>
                                    of Total Balance: <span><i
                                    className="zmdi zmdi-balance-wallet"/> {balanceFormat}&nbsp;APL</span>
                                </div>
                            )}
                            <div className="btn-box align-buttons-inside align-center form-footer">
                                <button
                                    type="submit"
                                    name={'closeModal'}
                                    className={'btn btn-lg btn-green submit-button'}
                                >
                                    <span className={'button-text'}>Sell APL</span>
                                </button>
                            </div>
                        </form>
                    )}/>
            </div>
        )
    }
}

const mapStateToProps = ({account}) => ({
    account: account.account,
    balanceAPL: account.unconfirmedBalanceATM,
    passPhrase: account.passPhrase,
});

const mapDispatchToProps = dispatch => ({
    createOffer: (params) => dispatch(createOffer(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeSell);