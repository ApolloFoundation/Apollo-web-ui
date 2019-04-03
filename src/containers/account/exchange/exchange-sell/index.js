import React from 'react';
import classNames from 'classnames';
import {Form} from "react-form";
import {NotificationManager} from "react-notifications";
import InputForm from '../../../components/input-form';
import {formatCrypto} from "../../../../helpers/format";

class ExchangeSell extends React.Component {
    handleFormSubmit = () => {
        if (this.props.wallet) {
            NotificationManager.error('This functionality will be delivered in April 2019.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    render () {
        const {currentCurrency: {currency}, wallet} = this.props;
        const balanceFormat = wallet && wallet.wallets && formatCrypto(wallet.wallets[0].balance);
        return (
            <div className={'card-block green card card-medium pt-0 h-100'}>
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, getFormState, setValue, values
                             }) => (
                        <form className="modal-form modal-send-apollo modal-form"  onSubmit={submitForm}>
                            <div className="form-title">
                                <p>Sell {currency.toUpperCase()}</p>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    Price for 1 APL
                                </label>
                                <div className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="price"
                                        type={"float"}
                                        onChange={() => setValue("total", values.amount * values.price)}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">{currency.toUpperCase()}</span>
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
                                        field="amount"
                                        type={"float"}
                                        onChange={() => setValue("total", values.amount * values.price)}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">APL</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    I will pay
                                </label>
                                <div
                                    className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="total"
                                        type={"float"}
                                        setValue={setValue}
                                        disabled />
                                    <div className="input-group-append">
                                        <span className="input-group-text">{currency.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                            {wallet && wallet.wallets && (
                                <div className={'form-group-text d-flex justify-content-between'}>
                                    of Total Balance: <span><i className="zmdi zmdi-balance-wallet"/> {balanceFormat} {currency.toUpperCase()}</span>
                                </div>
                            )}
                            <div className="btn-box align-buttons-inside align-center form-footer">
                                <button
                                    type="submit"
                                    name={'closeModal'}
                                    className={'btn btn-lg btn-green submit-button'}
                                >
                                    <span className={'button-text'}>Sell Apollo</span>
                                </button>
                            </div>
                        </form>
                    )}/>
            </div>
        )
    }
}

export default ExchangeSell;