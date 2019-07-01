import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {Form} from 'react-form';
import InputForm from '../../../components/input-form';
import CustomFormSelect from "../../../components/form-components/custom-form-select";
import ContentLoader from "../../../components/content-loader";
import {getTransactionFee, walletWithdraw} from '../../../../actions/wallet';
import {currencyTypes, formatGweiToEth} from '../../../../helpers/format';
import classNames from "classnames";

class WithdrawCurrency extends React.Component {
    state = {
        transactionFee: null,
        fee: null,
        currency: 'eth',
        isPending: false,
    };

    componentDidMount() {
        this.getTransactionFee();
    }

    handleFormSubmit = async (values) => {
        if (!this.state.isPending) {

            if (!values.toAddress) {
                NotificationManager.error('To wallet is required.', 'Error', 5000);
                return;
            }
            if (!values.amount) {
                NotificationManager.error('Amount is required.', 'Error', 5000);
                return;
            }
            if (!values.secretPhrase || values.secretPhrase.length === 0) {
                NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
                return;
            }

            const gasLimit = values.asset.currency === 'eth' ? this.props.constants.gasLimitEth : this.props.constants.gasLimitERC20;
            const maxFee = this.state.fee.value * gasLimit * 0.000000001;
            const balance = parseFloat(values.asset.balance);
            const amount = parseFloat(values.amount);

            if (balance === 0 || balance < (amount + maxFee)) {
                NotificationManager.error(`Not enough founds on your ${values.asset.currency.toUpperCase()} balance.`, 'Error', 5000);
                return;
            }


            this.setState({isPending: true});

            const params = {
                fromAddress: values.fromAddress,
                toAddress: values.toAddress,
                amount: values.amount,
                transferFee: parseFloat(this.state.fee.value),
                cryptocurrency: currencyTypes[this.state.currency],
                passphrase: values.secretPhrase,
                sender: this.props.account,
            };

            const result = await this.props.walletWithdraw(params);
            if (result) {
                NotificationManager.success('Successfully sent.', null, 5000);
                this.props.closeModal();
            }

            this.setState({isPending: false});
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

    handleChangeAsset = (value) => {
        this.setState({currency: value.currency});
    };

    getAssetTypes = () => {
        const balances = this.props.modalData ? this.props.modalData.balances : {};
        return Object.keys(balances).map((currency, i) => (
            {
                value: {
                    currency,
                    balance: balances[currency]
                },
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
                                    <div className="form-group mb-15">
                                        <label>
                                            From
                                        </label>
                                        <div>
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
                                    <div className="form-group mb-15">
                                        <label>
                                            To
                                        </label>
                                        <div>
                                            <InputForm
                                                field="toAddress"
                                                placeholder={`${currencyFormat} Wallet`}
                                                type={"text"}
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    {currency && (
                                        <CustomFormSelect
                                            defaultValue={typeData.find(type => type.value.currency === currency)}
                                            setValue={setValue}
                                            options={typeData}
                                            label={'Wallet'}
                                            field={'asset'}
                                            onChange={this.handleChangeAsset}
                                        />
                                    )}
                                    <div className="form-group mb-15">
                                        <label htmlFor={"withdraw-modal-amount"}>
                                            Amount
                                        </label>
                                        <div className="input-group">
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
                                    <React.Fragment>
                                        <div className="form-group mb-15">
                                            <label>
                                                Gas Fee
                                            </label>
                                            <div>
                                                {transactionFee && this.state.fee ? (
                                                    <div className="btn-group btn-group-switch w-100"
                                                         role="group"
                                                         aria-label="Gas Fee">
                                                        <button
                                                            type="button"
                                                            className={`w-100 p-2 btn btn-secondary btn-grey ${this.state.fee.level === 'safeLow' ? 'btn-green' : ''}`}
                                                            onClick={() => this.handleSelectTransactionFee({
                                                                level: 'safeLow',
                                                                value: transactionFee['safeLow']
                                                            })}
                                                        >
                                                            <span className="text-uppercase">SafeLow</span>
                                                            <small>{formatGweiToEth(transactionFee['safeLow'], 0)} ETH</small>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`w-100 p-2 btn btn-secondary btn-grey ${this.state.fee.level === 'average' ? 'btn-green' : ''}`}
                                                            onClick={() => this.handleSelectTransactionFee({
                                                                level: 'average',
                                                                value: transactionFee['average']
                                                            })}
                                                        >
                                                            <span className="text-uppercase">Average</span>
                                                            <small>{formatGweiToEth(transactionFee['average'], 0)} ETH</small>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`w-100 p-2 btn btn-secondary btn-grey ${this.state.fee.level === 'fast' ? 'btn-green' : ''}`}
                                                            onClick={() => this.handleSelectTransactionFee({
                                                                level: 'fast',
                                                                value: transactionFee['fast']
                                                            })}
                                                        >
                                                            <span className="text-uppercase">Fast</span>
                                                            <small>{formatGweiToEth(transactionFee['fast'], 0)} ETH</small>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <ContentLoader className={'m-0 p-0'}/>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group mb-15">
                                            <label>
                                                Max Fee
                                            </label>
                                            <div>
                                                {this.state.fee ? (
                                                    <span>{formatGweiToEth(this.state.fee.value * gasLimit, 0)} ETH</span>
                                                ) : (
                                                    <ContentLoader className={'m-0 p-0'}/>
                                                )}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                    <div className="form-group mb-15">
                                        <label>
                                            Secret phrase
                                        </label>
                                        <div>
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
                                <div className="btn-box right-conner align-right form-footer">
                                    <button
                                        type={'button'}
                                        onClick={() => this.props.closeModal()}
                                        className="btn btn-default mr-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={classNames({
                                            "btn btn-green submit-button": true,
                                            "loading": this.state.isPending,
                                            "btn-green-disabled": !this.state.fee || this.state.isPending,
                                        })}
                                    >
                                        <div className="button-loader">
                                            <div className="ball-pulse">
                                                <div/>
                                                <div/>
                                                <div/>
                                            </div>
                                        </div>
                                        <span className={'button-text'}>Withdraw</span>
                                    </button>
                                </div>
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
    modalData: state.modals.modalData,
    constants: state.account.constants,
});

const mapDispatchToProps = dispatch => ({
    walletWithdraw: (params) => dispatch(walletWithdraw(params)),
    getTransactionFee: () => dispatch(getTransactionFee()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawCurrency);