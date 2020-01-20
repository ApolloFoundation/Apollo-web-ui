import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table';
import InfoBox from '../../../components/info-box';
import CurrencyDescriptionComponent from './currency';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {getCurrencyBalance} from "../../../../actions/wallet";
import getFullNumber from '../../../../helpers/util/expancionalParser';
import {readFromLocalStorage} from "../../../../actions/localStorage";
import {setCurrentCurrencyAction} from "../../../../modules/exchange";

class ChooseWallet extends React.Component {
    state = {
        wallets: null,
        loading: false,
    };

    componentDidMount() {
        let wallets = JSON.parse(localStorage.getItem('wallets'));
        if (!wallets) {
            this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
        } else {
            this.getCurrencyBalance(wallets);
        }
    }

    componentDidUpdate() {
        if (!this.state.wallets && this.props.wallets && !this.state.loading) {
            this.getCurrencyBalance(this.props.wallets);
        }
    }

    getCurrencyBalance = async (wallets) => {
        this.setState({loading: true});
        let params = {};
        wallets.map(wallet => {
            params[wallet.currency] = [];
            wallet.wallets.map(walletItem => {
                params[wallet.currency].push(walletItem.address);
                return walletItem;
            });
            return wallet;
        });
        const walletsBalances = await this.props.getCurrencyBalance(params);
        if (walletsBalances) {
            this.setState({wallets: walletsBalances, loading: false});
        } else {
            this.setState({loading: false});
        }
    };

    handleCurrentCurrency = (currency) => {
        this.props.setCurrentCurrency(currency);
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Wallets'}
                />
                <div className="exchange page-body container-fluid pl-3">
                    {!this.state.loading ? (
                        this.state.wallets ? (
                            <div className={'card-block primary form-group-app p-0 mb-3'}>
                                <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
                                    <p className="title-lg">My Wallets</p>
                                </div>
                                {Object.keys(this.state.wallets).map((currency, i) => (
                                    <CustomTable
                                        key={i}
                                        header={[
                                            {
                                                name: `Wallets`,
                                                alignRight: false
                                            }, {
                                                name: `Amount ETH`,
                                                alignRight: false
                                            }, {
                                                name: `Amount PAX`,
                                                alignRight: false
                                            }, {
                                                name: `Buy`,
                                                alignRight: false
                                            }, {
                                                name: `Sell`,
                                                alignRight: false
                                            }, {
                                                name: 'Transactions history',
                                                alignRight: false
                                            }, {
                                                name: 'Actions',
                                                alignRight: true
                                            }
                                        ]}
                                        className={'pt-0 no-min-height no-padding rounded-top'}
                                        tableData={this.state.wallets[currency].map(wallet => {
                                            return ({
                                            ...wallet,
                                            balances: {
                                                ...wallet.balances,
                                                pax: getFullNumber(Number(wallet.balances.pax)),
                                                eth: getFullNumber(Number(wallet.balances.eth)),
                                            }
                                        })}) }
                                        passProps={{currency, handleCurrentCurrency: this.handleCurrentCurrency}}
                                        emptyMessage={'No wallet info found.'}
                                        TableRowComponent={CurrencyDescriptionComponent}
                                    />
                                ))}
                            </div>
                        ):(
                            <div>
                                <InfoBox default>
                                    You have no Wallet at the moment.&nbsp;
                                    <a className={'blue-link-text'} onClick={() => this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {})}>Log in</a>
                                </InfoBox>
                            </div>
                        )
                    ):(
                        <div className={'align-items-center loader-box'}>
                            <div className="ball-pulse">
                                <div/>
                                <div/>
                                <div/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    wallets: state.account.wallets,
});

const mapDispatchToProps = dispatch => ({
    getCurrencyBalance: (params) => dispatch(getCurrencyBalance(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
    setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseWallet);