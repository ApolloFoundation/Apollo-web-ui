import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {Form} from 'react-form';
import InputForm from '../../../components/input-form';
import {getTransactionFee, walletWithdraw} from '../../../../actions/wallet';
import {currencyTypes, formatGweiToEth} from '../../../../helpers/format';
import CustomFormSelect from "../../../components/form-components/custom-form-select";

class WithdrawCurrency extends React.Component {
    state = {
        transactionFee: null,
        fee: null,
        currency: 'eth',
    };

    componentDidMount() {
        this.getTransactionFee();
    }

    handleFormSubmit = async (values) => {
        if (!values.toAddress) {
            NotificationManager.error('To wallet is required field.', 'Error', 5000);
            return;
        }
        if (!values.amount) {
            NotificationManager.error('Amount is required.', 'Error', 5000);
            return;
        }

        const params = {
            ...values,
            // account: this.props.account,
            // secretPhrase: values.secretPhrase,
            transferFee: parseFloat(this.state.fee.value),
            cryptocurrency: currencyTypes[this.state.currency],
        };

        const result = await this.props.walletWithdraw(params);
        if (result) {
            NotificationManager.success('Successfully sent.', null, 5000);
        }
    };

    getTransactionFee = async () => {
        const transactionFee = await this.props.getTransactionFee();
        if (transactionFee) {
            const level = Object.keys(transactionFee)[1];
            this.setState({
                transactionFee,
                fee: {
                    level: level,
                    value: transactionFee[level],
                }
            });
        }
    };

    handleSelectTransactionFee = (fee) => {
        this.setState({fee});
    };

    handleChangeAsset = (currency) => {
        this.setState({currency});
    };

    getAssetTypes = () => {
        const balances = this.props.modalData ? this.props.modalData.balances : {};
        return Object.keys(balances).map((currency, i) => (
            {
                value: currency,
                label: `${currency.toUpperCase()} - Balance: ${balances[currency]} ${currency.toUpperCase()}`
            }
        ));
    };

    render() {
        const {modalData: {address}, constants} = this.props;
        const {transactionFee, currency} = this.state;
        const currencyFormat = currency.toUpperCase();
        const gasLimit = currency === 'eth' ? constants.gasLimitEth : constants.gasLimitERC20;
        const typeData = this.getAssetTypes();
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, setValue}) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>
                                <div className="form-title">
                                    <p>Withdraw</p>
                                </div>
                                <div className="input-group-app">
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            From
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="fromAddress"
                                                placeholder={`${currencyFormat} Wallet`}
                                                type={"text"}
                                                setValue={setValue}
                                                defaultValue={address}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            To
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="toAddress"
                                                placeholder={`${currencyFormat} Wallet`}
                                                type={"text"}
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    {currency && (
                                        <CustomFormSelect
                                            defaultValue={typeData.find(type => type.value === currency)}
                                            setValue={setValue}
                                            options={typeData}
                                            label={'Asset'}
                                            field={'asset'}
                                            onChange={this.handleChangeAsset}
                                        />
                                    )}
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
                                    {this.state.fee && (
                                        <React.Fragment>
                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Gas Fee
                                                </label>
                                                <div className="col-sm-9">
                                                    <div className="btn-group w-100" role="group" aria-label="Basic example">
                                                        {transactionFee && Object.keys(transactionFee).map((key, index) => (
                                                            <button
                                                                type="button"
                                                                className={`w-100 btn btn-secondary submit-button ${this.state.fee.level === key ? 'blue': ''}`}
                                                                onClick={() => this.handleSelectTransactionFee({level: key, value: transactionFee[key]})}
                                                            >
                                                                <span className={'text-uppercase'}>{key}</span><br/>
                                                                <small>{formatGweiToEth(transactionFee[key], 0)} {currencyFormat}</small>
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
                                                    {formatGweiToEth(this.state.fee.value * gasLimit, 0)} {currencyFormat}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    {/*<div className="form-group row form-group-white mb-15">
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
                                    </div>*/}
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
    constants: state.account.constants,
});

const mapDispatchToProps = dispatch => ({
    walletWithdraw: (params) => dispatch(walletWithdraw(params)),
    getTransactionFee: () => dispatch(getTransactionFee()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawCurrency);