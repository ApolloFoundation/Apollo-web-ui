import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {Form} from 'react-form';
import InputForm from '../../../components/input-form';
import {getTransactionFee, walletWidthraw} from '../../../../actions/wallet';
import {formatGweiToEth} from '../../../../helpers/format';

class WithdrawCurrency extends React.Component {
    state = {
        transactionFee: null,
        fee: null,
    };

    componentDidMount() {
        this.getTransactionFee();
    }

    handleFormSubmit = async (values) => {
        NotificationManager.error('This functionality will be delivered in May 2019.', 'Error', 5000);
        return;

        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const params = {
            account: this.props.account,
            secretPhrase: values.secretPhrase,
            amount: values.amount,
            address: values.address,
            cryptocurrency: this.props.modalData.currency,
        };

        const result = await this.props.walletWidthraw(params);
        if (result) {
            NotificationManager.success('Successfully sent.', null, 5000);
        }
    };

    getTransactionFee = async () => {
        const transactionFee = await this.props.getTransactionFee(this.props.modalData.currency);
        if (transactionFee) {
            this.setState({transactionFee, fee: transactionFee[Object.keys(transactionFee)[1]]});
        }
    };

    handleSelectTransactionFee = (fee) => {
        this.setState({fee});
    };

    render() {
        const {currency, address, balance} = this.props.modalData;
        const {transactionFee} = this.state;
        const currencyFormat = currency.toUpperCase();
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>
                                <div className="form-title">
                                    <p>Withdraw {currencyFormat}</p>
                                </div>
                                <div className="input-group-app">
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            From
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="from"
                                                placeholder={`${currencyFormat} Wallet`}
                                                type={"text"}
                                                setValue={setValue}
                                                defaultValue={address}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            To
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="to"
                                                placeholder={`${currencyFormat} Wallet`}
                                                type={"text"}
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Balance
                                        </label>
                                        <div className="col-sm-9">
                                            <p>
                                                {balance} {currencyFormat}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label htmlFor={"withdraw-modal-amount"} className="col-sm-3 col-form-label">
                                            Amount
                                        </label>
                                        <div
                                            className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                            <InputForm
                                                field="amount"
                                                placeholder="Amount"
                                                type={"float"}
                                                setValue={setValue}
                                                id={"withdraw-modal-amount"}
                                                defaultValue={0}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text">{currencyFormat}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Gas Fee
                                        </label>
                                        <div className="col-sm-9">
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                {transactionFee && Object.keys(transactionFee).map((key, index) => (
                                                    <button
                                                        type="button"
                                                        className={`btn btn-secondary submit-button ${this.state.fee === transactionFee[key] ? 'blue': ''}`}
                                                        onClick={() => this.handleSelectTransactionFee(transactionFee[key])}
                                                    >
                                                        <span className={'text-uppercase'}>{key}</span><br/>
                                                        <small>{formatGweiToEth(transactionFee[key])} {currencyFormat}</small>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Max Fee
                                        </label>
                                        <div className="col-sm-9">
                                            {formatGweiToEth(this.state.fee * values.amount)} {currencyFormat}
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Secret phrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                isPlain
                                                className={'form-control'}
                                                type="password"
                                                field="secretPhrase"
                                                placeholder="Secret Phrase"
                                                setValue={setValue}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit"
                                        className="btn btn-right blue round round-bottom-right round-top-left absolute">
                                    Withdraw
                                </button>
                            </div>
                        </form>
                    )
                    }/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    secretPhrase: state.account.passPhrase,
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    walletWidthraw: (params) => dispatch(walletWidthraw(params)),
    getTransactionFee: (currency) => dispatch(getTransactionFee(currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawCurrency);