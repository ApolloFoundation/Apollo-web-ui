import React from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-form';
import {NotificationManager} from 'react-notifications';
import classNames from "classnames";
import InputForm from '../../../../components/input-form';
import CustomSelect from '../../../../components/select';
import {currencyTypes, formatDivision, multiply} from '../../../../../helpers/format';
import {createOffer} from '../../../../../actions/wallet';
import {setBodyModalParamsAction, resetTrade, setSelectedOrderInfo} from '../../../../../modules/modals';
import {ONE_APL, ONE_GWEI} from '../../../../../constants';
import {ReactComponent as ArrowRight} from "../../../../../assets/arrow-right.svg";
import InputRange from "../../../../components/input-range";

class SellForm extends React.PureComponent {
    feeATM = 200000000;
    state = {
        isPending: false,
        form: null,
        currentCurrency: null,
        wallet: null,
        walletsList: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.currentCurrency && (props.currentCurrency.currency !== state.currentCurrency || props.wallet !== state.wallet)) {
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

    componentDidUpdate() {
        if(this.props.infoSelectedSellOrder) {
            const numberTypes = {
                NaN: '0',
                Infinity: 100,
            }
            const { balanceAPL, dashboardAccoountInfo } = this.props;
            const { pairRate, offerAmount, total } = this.props.infoSelectedSellOrder;
            const normalizeOfferAmount = offerAmount.replaceAll(',', '');
            const balance = (dashboardAccoountInfo && dashboardAccoountInfo.unconfirmedBalanceATM) ? dashboardAccoountInfo.unconfirmedBalanceATM : balanceAPL;
            const balanceFormat = balance ? (balance / ONE_APL) : 0;
            const { form, wallet } = this.state;
            const rangeValue = (normalizeOfferAmount * 100 / balanceFormat).toFixed(0);
            form.setAllValues({
                walletAddress: wallet && wallet[0],
                pairRate: pairRate,
                offerAmount: normalizeOfferAmount,
                total: +total,
                range: numberTypes[rangeValue] || rangeValue,
            });
        }
    }

    handleFormSubmit = (values) => {
        if (!this.state.isPending) {
            this.props.setSelectedOrderInfo({pairRate: values.pairRate, offerAmount: values.offerAmount, total: values.total, type: 'SELL'});
            this.setPending();
            if (this.props.wallet) {
                if (values.offerAmount > 0 && values.pairRate > 0) {
                    const currency = this.props.currentCurrency.currency;
                    let isError = false;
                    if (values.pairRate < 0.000000001) {
                        NotificationManager.error(`Price must be more then 0.000000001 ${currency.toUpperCase()}`, 'Error', 5000);
                        isError = true;
                    }
                    if (values.offerAmount < 0.001) {
                        NotificationManager.error('You can sell more then 0.001 APL', 'Error', 5000);
                        isError = true;
                    }
                    if (!this.props.ethFee || +this.props.ethFee === 0) {
                        NotificationManager.error('Can\'t get Gas fee. Something went wrong. Please, try again later', 'Error', 5000);
                        isError = true;
                    }
                    if (+this.props.ethFee > +values.walletAddress.balances.eth) {
                        NotificationManager.error(`To sell APL you need to have at least ${this.props.ethFee.toLocaleString('en')} ETH on your balance to confirm transaction`, 'Error', 5000);
                        isError = true;
                    }
                    if (isError) {
                        this.props.resetTrade();
                        this.setPending(false);
                        return;
                    }                    
                    const pairRate = multiply(values.pairRate, ONE_GWEI);
                    const offerAmount = multiply(values.offerAmount, ONE_GWEI);
                    const balanceAPL = (this.props.dashboardAccoountInfo && this.props.dashboardAccoountInfo.unconfirmedBalanceATM) ?
                        parseFloat(this.props.dashboardAccoountInfo.unconfirmedBalanceATM)
                        :
                        parseFloat(this.props.balanceAPL);

                    if (!this.props.balanceAPL || balanceAPL === 0 || balanceAPL < ((offerAmount + this.feeATM) / 10)) {
                        NotificationManager.error('Not enough funds on your APL balance.', 'Error', 5000);
                        this.setPending(false);
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
                        this.props.createOffer(params).then(() => {
                            this.setPending(false);
                        });
                        if (this.state.form) {
                            this.props.resetTrade();
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
                            resetForm: () => {
                                this.props.resetTrade();
                                this.state.form.setAllValues({
                                walletAddress: values.walletAddress,
                                pairRate: '',
                                offerAmount: '',
                                total: '',
                            })}
                        });
                        this.setPending(false);
                    }
                } else {
                    NotificationManager.error('Price and amount are required', 'Error', 5000);
                    this.setPending(false);
                }
            } else {
                this.setPending(false);
                this.props.handleLoginModal();
            }
        }
    };

    setPending = (value = true) => this.setState({isPending: value})

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
        const balanceFormat = balance ? (balance / ONE_APL) : 0;
        const currencyName = currency.toUpperCase();
        const numberTypes = {
            NaN: '0',
            Infinity: 100,
        }
        return (
            <Form
                onSubmit={values => this.handleFormSubmit(values)}
                getApi={this.getFormApi}
                render={({
                             submitForm, setValue, values
                         }) => (
                    <form
                        className="form-group-app d-flex flex-column justify-content-between h-100 mb-0"
                        onSubmit={submitForm}
                    >
                        {this.state.walletsList && !!this.state.walletsList.length && (
                            <div className="form-group mb-3">
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
                        <div className="form-group mb-3">
                            <label>
                                Price for 1 APL
                            </label>
                            <div className="input-group">
                                <InputForm
                                    field="pairRate"
                                    type={"float"}
                                    onChange={(price) => {
                                        let amount = values.offerAmount || 0;
                                        if (balanceFormat) {
                                            if (amount > balanceFormat) {
                                                amount = balanceFormat;
                                            }
                                            let rangeValue = (amount * 100 / balanceFormat).toFixed(0);
                                            setValue("range", numberTypes[rangeValue] || rangeValue);
                                        }
                                        setValue("total", multiply(amount, price));
                                    }}
                                    setValue={setValue}
                                    disableArrows
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text">{currencyName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>
                                I want to Sell
                            </label>
                            <div className="input-group">
                                <InputForm
                                    field="offerAmount"
                                    type={"float"}
                                    onChange={(amount) => {
                                        const pairRate = +values.pairRate || 0;
                                        if (+balanceFormat) {
                                            if (+amount > +balanceFormat) {
                                                amount = balanceFormat;
                                            }
                                            let rangeValue = (amount * 100 / balanceFormat).toFixed(0);
                                            setValue("range", numberTypes[rangeValue] || rangeValue);
                                        }
                                        setValue("total", multiply(amount, pairRate));
                                    }}
                                    setValue={setValue}
                                    disableArrows
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text">
                                        {wallet && balanceFormat !== false && (
                                            <span className={'input-group-info-text'}><i className="zmdi zmdi-balance-wallet"/>&nbsp;
                                                {balanceFormat.toLocaleString('en', {
                                                    minimumFractionDigits: 3,
                                                    maximumFractionDigits: 3
                                                })}&nbsp;</span>
                                        )}
                                        APL</span>
                                </div>
                                <small className={'text-note'}>Will be frozen on your balance during 24 hours.</small>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>
                                I will receive
                            </label>
                            <div className="input-group">
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
                        {values.walletAddress && (
                            <InputRange
                                field="range"
                                min={0}
                                max={100}
                                onChange={(amount) => {
                                    const offerAmount = values.pairRate !== '0' ? ((amount * balanceFormat) / 100).toFixed(3) : 0;
                                    setValue("offerAmount", offerAmount);
                                    setValue("total", multiply(offerAmount, values.pairRate));
                                }}
                            />
                        )}
                        <button
                            type={'submit'}
                            className={classNames({
                                "btn btn-green btn-lg": true,
                                "loading btn-green-disabled": this.state.isPending,
                            })}
                        >
                            <div className="button-loader">
                                <div className="ball-pulse">
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>
                            <span className={'button-text'}>Sell APL</span>
                            <div className={'btn-arrow'}>
                                <ArrowRight/>
                            </div>
                        </button>
                    </form>
                )}/>
        )
    }
}

const mapStateToProps = ({account, dashboard, exchange, modals}) => ({
    account: account.account,
    balanceAPL: account.unconfirmedBalanceATM,
    infoSelectedSellOrder: modals.infoSelectedSellOrder,
    dashboardAccoountInfo: dashboard.dashboardAccoountInfo,
    passPhrase: account.passPhrase,
    currentCurrency: exchange.currentCurrency,
});

const mapDispatchToProps = dispatch => ({
    createOffer: (params) => dispatch(createOffer(params)),
    resetTrade: () => dispatch(resetTrade()),
    setSelectedOrderInfo: (params) => dispatch(setSelectedOrderInfo(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellForm);
