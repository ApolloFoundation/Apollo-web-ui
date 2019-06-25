import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {CopyToClipboard} from "react-copy-to-clipboard";
import classNames from 'classnames';
import ContentLoader from '../../components/content-loader';
import {formatTimestamp} from "../../../helpers/util/time";
import {setBodyModalParamsAction} from '../../../modules/modals';
import {ONE_APL} from '../../../constants';
import {getForging, setForging} from "../../../actions/login";
import {getIdaxPair} from "../../../actions/wallet";
import {ReactComponent as ArrowRight} from "../../../assets/arrow-right.svg";

class TotalBalance extends Component {
    state = {
        ticker: null,
    };

    componentDidMount() {
        this.getIdaxPair('APL_ETH');
        this.getIdaxPair('ETH_USDT');
    }

    getIdaxPair = async (pair) => {
        const ticker = await this.props.getIdaxPair({pair});
        if (ticker) {
            this.setState((state) => ({
                ticker: {
                    ...state.ticker,
                    [pair]: ticker[0]
                }
            }));
        }
    };

    setForgingData = (action) => {
        return {
            getStatus: action,
            handleSuccess: (res) => {
                this.setState({forgingStatus: res});
            }
        }
    };

    handleSetForging = async (action) => {
        if (!this.props.effectiveBalanceAPL || this.props.effectiveBalanceAPL < 1000) {
            NotificationManager.error('You can start forging only if your effective balance exceed 1000 APL.', 'Error', 5000);
            return;
        }
        const passPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || this.props.secretPhrase;
        if (!passPhrase || this.props.is2FA) {
            this.props.setBodyModalParamsAction('CONFIRM_FORGING', this.setForgingData(action))
        } else {
            const forging = await this.props.setForging({requestType: action});

            if (forging) {
                if (!forging.errorCode) {
                    const forgingStatus = await this.props.getForging();

                    if (!forgingStatus.errorCode || forgingStatus.errorCode === 5) {
                        this.setState({forgingStatus: forgingStatus});
                    } else {
                        NotificationManager.error('Something went wrong. Please, try again later', 'Error', 5000);
                    }
                } else {
                    NotificationManager.error(forging.errorDescription, 'Error', 5000);
                }
            }
        }
    };

    render() {
        const {dashboardAccountInfo, actualBlock, setBodyModalParamsAction, blockchainStatus, timestamp, formatTimestamp, forgingStatus} = this.props;
        const balanceAPL = (dashboardAccountInfo && dashboardAccountInfo.unconfirmedBalanceATM) ? Math.round(dashboardAccountInfo.unconfirmedBalanceATM / ONE_APL).toLocaleString('de-DE') : 0;
        const tickerAplPricePercent = this.state.ticker && this.state.ticker.APL_ETH ? (this.state.ticker.APL_ETH.last * 100 / this.state.ticker.APL_ETH.open - 100) : 0;
        const tickerEthPricePercent = this.state.ticker && this.state.ticker.ETH_USDT ? (this.state.ticker.ETH_USDT.last * 100 / this.state.ticker.ETH_USDT.open - 100) : 0;
        return (
            <div className={`card card-xl card-double card-primary-action`}>
                <div
                    className="card-title card-title-lg bg-primary cursor-pointer"
                    onClick={() => setBodyModalParamsAction('ACCOUNT_DETAILS')}
                >
                    <div className={'title'}>My Total Balance</div>
                    <div className={'balance-info'}>
                        <span className={'balance'}>{balanceAPL}</span>
                        <span className={'currency'}>APL</span>
                    </div>
                </div>
                <div className="card-body">
                    {dashboardAccountInfo ? (
                        <div className={'form-group-app'}>
                            <div className={'row mb-3'}>
                                <div className={'col-md-6'}>
                                    <label>Wallet ID:</label>
                                    <CopyToClipboard
                                        text={dashboardAccountInfo.accountRS}
                                        onCopy={() => {
                                            NotificationManager.success('The account has been copied to clipboard.')
                                        }}
                                    >
                                        <div>
                                            <input
                                                className={'cursor-pointer'}
                                                value={dashboardAccountInfo.accountRS}
                                                disabled={true}
                                            />
                                        </div>
                                    </CopyToClipboard>
                                </div>
                                <div className={'col-md-6'}>
                                    {!!(actualBlock && timestamp) && (
                                        <div className={'ml-15'}>
                                            <span className={'label label-icon-left'}><i className="zmdi zmdi-time"/> Last updated:&nbsp;</span>
                                            <span>Block {actualBlock}</span><br/>
                                            <span>{formatTimestamp(timestamp)}</span>
                                        </div>
                                    )}
                                    {!!(blockchainStatus && blockchainStatus.blockTime) && (
                                        <div className={'ml-15'}>
                                            <span className={'label'}>Transaction time:&nbsp;</span>
                                            <span>{blockchainStatus.blockTime} sec</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col-md-12'}>
                                    <div className={'connect-status-wrap'}>
                                        <div className="connect-status success">
                                            <div className="connect-icon"/>
                                            <span>Connected</span>
                                        </div>
                                        {forgingStatus && (
                                            !forgingStatus.errorCode ? (
                                                <div className="connect-status success">
                                                    <div className="connect-icon"/>
                                                    <span>Forging</span>
                                                    <button
                                                        type={'button'}
                                                        className={'btn btn-xs btn-primary ml-2'}
                                                        onClick={() => this.handleSetForging('stopForging')}
                                                    >
                                                        Stop
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="connect-status">
                                                    <div className="connect-icon"/>
                                                    <span>{forgingStatus.errorCode === 5 ? "Not forging" : "Unknown forging status"}</span>
                                                    <button
                                                        type={'button'}
                                                        className={'btn btn-xs btn-primary ml-2'}
                                                        onClick={() => this.handleSetForging('startForging')}
                                                    >
                                                        Start
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ContentLoader white noPaddingOnTheSides/>
                    )}
                </div>
                <div className="card-body card-sub-body">
                    <div className={'exchange-chart-wrap'}>

                    </div>
                    <div className={'exchange-info'}>
                        {this.state.ticker && this.state.ticker.APL_ETH && this.state.ticker.ETH_USDT && (
                            <div>
                                <div className={'label mb-1'}>Current APL Price:</div>
                                <div className={'d-flex mb-1'}>
                                    <span className={'exchange-info-price'}>${(this.state.ticker.APL_ETH.last * this.state.ticker.ETH_USDT.last).toFixed(6)}</span>
                                    <span className={'exchange-info-currency'}>USD</span>
                                    <span className={classNames({
                                        'exchange-info-price ml-2': true,
                                        'text-danger': tickerEthPricePercent < 0,
                                        'text-success': tickerEthPricePercent >= 0,
                                    })}>({tickerEthPricePercent > 0 && '+'}{(tickerEthPricePercent).toFixed(2)}%)</span>
                                </div>
                                <div className={'d-flex'}>
                                    <span className={'label'}>{this.state.ticker.APL_ETH.last} ETH</span>
                                    <span className={classNames({
                                        'label ml-2': true,
                                        'text-danger': tickerAplPricePercent < 0,
                                        'text-success': tickerAplPricePercent >= 0,
                                    })}>({tickerAplPricePercent > 0 && '+'}{(tickerAplPricePercent).toFixed(2)}%)</span>
                                </div>
                            </div>
                        )}
                        <button
                            type={'button'}
                            className={'btn btn-corner-primary'}
                        >
                            <span>Buy/sell</span>
                            <div className={'btn-arrow'}>
                                <ArrowRight/>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardAccountInfo: state.dashboard.dashboardAccoountInfo,
    actualBlock: state.account.actualBlock,
    timestamp: state.account.timestamp,
    blockchainStatus: state.account.blockchainStatus,
    forgingStatus: state.account.forgingStatus,
    secretPhrase: state.account.passPhrase,
    is2FA: state.account.is2FA,
    effectiveBalanceAPL: state.account.effectiveBalanceAPL,
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    setForging: (reqParams) => dispatch(setForging(reqParams)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
    getIdaxPair: (reqParams) => dispatch(getIdaxPair(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TotalBalance)