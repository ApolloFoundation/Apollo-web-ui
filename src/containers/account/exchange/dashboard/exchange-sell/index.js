import React from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-form';
import {NotificationManager} from 'react-notifications';
import InputForm from '../../../../components/input-form';
import CustomSelect from '../../../../components/select';
import {currencyTypes, formatDivision, multiply} from '../../../../../helpers/format';
import {createOffer} from '../../../../../actions/wallet';
import {setBodyModalParamsAction} from '../../../../../modules/modals';
import {ONE_APL, ONE_GWEI} from '../../../../../constants';

class ExchangeSell extends React.Component {
    feeATM = 200000000;
    state = {
        form: null,
        currentCurrency: null,
        wallet: null,
        walletsList: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.currentCurrency.currency !== state.currentCurrency || props.wallet !== state.wallet) {
            if (state.form && state.form.values) {
                state.form.setAllValues({
                    walletAddress: state.form.values.walletAddress,
                    pairRate: '',
                    offerAmount: '',
                    total: '',
                });
            }

            let walletsList = props.wallet || [];
            walletsList = walletsList.map((wallet) => (
                {
                    value: wallet,
                    label: wallet.address
                }
            ));

            return {
                currentCurrency: props.currentCurrency.currency,
                wallet: props.wallet,
                walletsList,
            };
        }

        return null;
    }

    handleFormSubmit = (values) => {
        if (this.props.wallet) {
            if (values.offerAmount > 0 && values.pairRate > 0) {
                const currency = this.props.currentCurrency.currency;
                if (values.pairRate < 0.000000001) {
                    NotificationManager.error(`Price must be more then 0.000000001 ${currency.toUpperCase()}`, 'Error', 5000);
                    return;
                }
                if (values.offerAmount < 0.001) {
                    NotificationManager.error('You can sell more then 0.001 APL', 'Error', 5000);
                    return;
                }
                const pairRate = multiply(values.pairRate, ONE_GWEI);
                const offerAmount = multiply(values.offerAmount, ONE_GWEI);
                const balanceAPL = (this.props.dashboardAccoountInfo && this.props.dashboardAccoountInfo.unconfirmedBalanceATM) ?
                    parseFloat(this.props.dashboardAccoountInfo.unconfirmedBalanceATM)
                    :
                    parseFloat(this.props.balanceAPL);

                if (!this.props.balanceAPL || balanceAPL === 0 || balanceAPL < (offerAmount + this.feeATM)) {
                    NotificationManager.error('Not enough founds on your APL balance.', 'Error', 5000);
                    return;
                }

                const params = {
                    offerType: 1, // SELL
                    pairCurrency: currencyTypes[currency],
                    pairRate,
                    offerAmount,
                    sender: this.props.account,
                    passphrase: this.props.passPhrase,
                    feeATM: this.feeATM,
                    walletAddress: values.walletAddress.address,
                };

                if (this.props.passPhrase) {
                    this.props.createOffer(params);
                    if (this.state.form) {
                        this.state.form.setAllValues({
                            walletAddress: values.walletAddress,
                            pairRate: '',
                            offerAmount: '',
                            total: '',
                        });
                    }
                } else {
                    this.props.setBodyModalParamsAction('CONFIRM_CREATE_OFFER', {
                        params,
                        resetForm: () => this.state.form.setAllValues({
                            walletAddress: values.walletAddress,
                            pairRate: '',
                            offerAmount: '',
                            total: '',
                        })
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

    getWalletsList = () => {
        const wallets = this.props.wallet || [];
        return wallets.map((wallet) => (
            {
                value: wallet,
                label: wallet.address
            }
        ));
    };

    render() {
        const {currentCurrency: {currency}, wallet, balanceAPL, dashboardAccoountInfo} = this.props;
        const balance = (dashboardAccoountInfo && dashboardAccoountInfo.unconfirmedBalanceATM) ? dashboardAccoountInfo.unconfirmedBalanceATM : balanceAPL;
        const balanceFormat = balance ? formatDivision(balance, ONE_APL, 3) : 0;
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
                                <span>Fee: {this.feeATM/ONE_APL} APL</span>
                            </div>
                            {this.state.walletsList && !!this.state.walletsList.length && (
                                <div className="form-group row form-group-white mb-15">
                                    <label>
                                        {currencyName} Wallet
                                    </label>
                                    <CustomSelect
                                        className="form-control"
                                        field={'walletAddress'}
                                        defaultValue={this.state.walletsList[0]}
                                        setValue={setValue}
                                        options={this.state.walletsList}
                                    />
                                </div>
                            )}
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
                            {wallet && balanceFormat !== false && (
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

const mapStateToProps = ({account, dashboard}) => ({
    account: account.account,
    balanceAPL: account.unconfirmedBalanceATM,
    dashboardAccoountInfo: dashboard.dashboardAccoountInfo,
    passPhrase: account.passPhrase,
});

const mapDispatchToProps = dispatch => ({
    createOffer: (params) => dispatch(createOffer(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeSell);
