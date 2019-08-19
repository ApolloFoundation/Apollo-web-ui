import React from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-form';
import classNames from "classnames";
import {NotificationManager} from 'react-notifications';
import InputForm from '../../../../components/input-form';
import CustomSelect from '../../../../components/select';
import InputRange from "../../../../components/input-range";
import {currencyTypes, multiply} from '../../../../../helpers/format';
import {createOffer} from '../../../../../actions/wallet';
import {setBodyModalParamsAction} from '../../../../../modules/modals';
import {ONE_GWEI} from '../../../../../constants';
import {ReactComponent as ArrowRight} from "../../../../../assets/arrow-right.svg";

class BuyForm extends React.Component {
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

    handleFormSubmit = (values) => {
        if (!this.state.isPending) {
            this.setPending()
            if (this.props.wallet) {
                if (values.offerAmount > 0 && values.pairRate > 0) {
                    const currency = this.props.currentCurrency.currency;
                    let isError = false;
                    if (values.pairRate < 0.000000001) {
                        NotificationManager.error(`Price must be more then 0.000000001 ${currency.toUpperCase()}`, 'Error', 5000);
                        isError = true;
                    }
                    if (values.offerAmount < 0.001) {
                        NotificationManager.error('You can buy more then 0.001 APL', 'Error', 5000);
                        isError = true;
                    }
                    if (!values.walletAddress || !values.walletAddress.balances) {
                        NotificationManager.error('Please select wallet address', 'Error', 5000);
                        isError = true;
                    }
                    // if (!this.props.ethFee || +this.props.ethFee === 0) {
                    //     NotificationManager.error('Can\'t get Gas fee. Something went wrong. Please, try again later', 'Error', 5000);
                    //     isError = true;
                    // }
                    if (+this.props.ethFee > +values.walletAddress.balances.eth) {
                        NotificationManager.error(`To sell APL you need to have at least ${this.props.ethFee.toLocaleString('en')} ETH on your balance to confirm transaction`, 'Error', 5000);
                        isError = true;
                    }
                    if (isError) {
                        this.setPending(false);
                        return;
                    }
                    const pairRate = multiply(values.pairRate, ONE_GWEI);
                    const offerAmount = multiply(values.offerAmount, ONE_GWEI);
                    const balanceETH = parseFloat(values.walletAddress.balances[currency]);
                    const balanceAPL = (this.props.dashboardAccoountInfo && this.props.dashboardAccoountInfo.unconfirmedBalanceATM) ?
                        parseFloat(this.props.dashboardAccoountInfo.unconfirmedBalanceATM)
                        :
                        parseFloat(this.props.balanceAPL);
    
                    if (balanceETH === 0 || balanceETH < values.total) {
                        NotificationManager.error(`Not enough founds on your ${currency.toUpperCase()} balance.`, 'Error', 5000);
                        this.setPending(false);
                        return;
                    }
                    if (!this.props.balanceAPL || balanceAPL === 0 || balanceAPL < this.feeATM) {
                        NotificationManager.error('Not enough founds on your APL balance. You need to pay 2 APL fee.', 'Error', 5000);
                        this.setPending(false);
                        return;
                    }
    
                    const params = {
                        offerType: 0, // BUY
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
                                this.state.form.setAllValues({
                                walletAddress: values.walletAddress,
                                pairRate: '',
                                offerAmount: '',
                                total: '',
                            })}
                        })
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

    render() {
        const {currentCurrency: {currency}} = this.props;
        const currencyName = currency.toUpperCase();
        return (
            <Form
                onSubmit={values => this.handleFormSubmit(values)}
                getApi={this.getFormApi}
                render={({
                             submitForm, setValue, values
                         }) => {
                    const balance = values.walletAddress && values.walletAddress.balances[currency];
                    return (
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
                                            if (balance) {
                                                if ((amount * price) > balance) {
                                                    amount = balance / price;
                                                    setValue("range", 100);
                                                    setValue("total", balance);
                                                    setValue("offerAmount", amount);
                                                    return;
                                                } else {
                                                    setValue("range", ((amount * price) * 100 / balance).toFixed(0));
                                                }
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
                                    I want to Buy
                                </label>
                                <div
                                    className="input-group">
                                    <InputForm
                                        field="offerAmount"
                                        type={"float"}
                                        onChange={(amount) => {
                                            const pairRate = +values.pairRate || 0;
                                            if (balance) {
                                                if ((amount * pairRate) > +balance) {
                                                    amount = balance / pairRate;
                                                    setValue("range", 100);
                                                    setValue("total", balance);
                                                    setValue("offerAmount", amount);
                                                    return;
                                                } else {
                                                    setValue("range", (amount * pairRate * 100 / balance).toFixed(0));
                                                }
                                            }
                                            setValue("total", multiply(amount, pairRate));
                                        }}
                                        maxValue={values.pairRate ? balance/values.pairRate : null}
                                        setValue={setValue}
                                        disableArrows
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">APL</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label>
                                    I will pay
                                </label>
                                <div className="input-group">
                                    <InputForm
                                        field="total"
                                        type={"float"}
                                        setValue={setValue}
                                        disabled/>
                                    <div className="input-group-append">
                                    <span className="input-group-text">
                                        {values.walletAddress && (
                                            <span className={'input-group-info-text'}><i
                                                className="zmdi zmdi-balance-wallet"/>&nbsp;
                                                {values.walletAddress.balances[currency]}&nbsp;</span>
                                        )}
                                        {currencyName}</span>
                                    </div>
                                </div>
                            </div>
                            {values.walletAddress && (
                                <InputRange
                                    field="range"
                                    min={0}
                                    max={100}
                                    disabled={!values.pairRate || values.pairRate === '0' || values.pairRate === ''}
                                    onChange={(amount) => {
                                        const offerAmount = values.pairRate !== '0' ? ((amount * balance) / (100 * values.pairRate)).toFixed(10) : 0;
                                        setValue("offerAmount", offerAmount);
                                        setValue("total", multiply(offerAmount, values.pairRate));
                                    }}
                                />
                            )}
                            <button
                                type={'submit'}
                                className={'btn btn-green btn-lg'}
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
                                <span className={'button-text'}>Buy APL</span>
                                <div className={'btn-arrow'}>
                                    <ArrowRight/>
                                </div>
                            </button>
                        </form>
                    )
                }}
            />
        )
    }
}

const mapStateToProps = ({account, dashboard, exchange}) => ({
    account: account.account,
    balanceAPL: account.unconfirmedBalanceATM,
    dashboardAccoountInfo: dashboard.dashboardAccoountInfo,
    passPhrase: account.passPhrase,
    currentCurrency: exchange.currentCurrency,
});

const mapDispatchToProps = dispatch => ({
    createOffer: (params) => dispatch(createOffer(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyForm);
