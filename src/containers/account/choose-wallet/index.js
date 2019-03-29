import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import InfoBox from '../../components/info-box';
import CurrencyDescriptionComponent from './currency';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getCurrencyBalance} from "../../../actions/wallet";
import {setCurrentCurrencyAction} from "../../../modules/exchange";

class ChooseWallet extends React.Component {
    state = {
        wallets: null
    };

    componentDidMount() {
        let wallets = JSON.parse(localStorage.getItem('wallets'));
        if (!wallets) {
            this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
        } else {
            this.getCurrencyBalance(JSON.parse(wallets));
        }
    }

    componentDidUpdate() {
        if (!this.state.wallets && this.props.wallets) {
            this.getCurrencyBalance(this.props.wallets);
        }
    }

    getCurrencyBalance = async (wallets) => {
        let params = {};
        wallets.map(wallet => params[wallet.currency] = wallet.wallets[0].address);
        const balances = await this.props.getCurrencyBalance(params);
        if (balances) {
            wallets.map(wallet => wallet.wallets[0].balance = balances[`balance${wallet.currency.toUpperCase()}`]);
        }
        this.setState({wallets});
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
                    {this.state.wallets ?
                        <div className={'card-block primary form-group-app p-0 mb-3'}>
                            <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
                                <p className="title-lg">My Wallets</p>
                            </div>
                            {this.state.wallets.map(wallet => (
                            <CustomTable
                                header={[
                                    {
                                        name: `${wallet.currency.toUpperCase()} Wallet`,
                                        alignRight: false
                                    }, {
                                        name: `Amount ${wallet.currency.toUpperCase()}`,
                                        alignRight: false
                                    }, {
                                        name: `Buy ${wallet.currency.toUpperCase()}`,
                                        alignRight: false
                                    }, {
                                        name: `Sell ${wallet.currency.toUpperCase()}`,
                                        alignRight: false
                                    }, {
                                        name: 'Transactions history',
                                        alignRight: false
                                    }, {
                                        name: 'Withdraw',
                                        alignRight: true
                                    }
                                ]}
                                className={'pt-0 no-min-height no-padding rounded-top'}
                                tableData={wallet.wallets}
                                passProps={{currency: wallet.currency, handleCurrentCurrency: this.handleCurrentCurrency}}
                                emptyMessage={'No wallet info found.'}
                                TableRowComponent={CurrencyDescriptionComponent}
                            />
                            ))}
                        </div>
                        :
                        <div>
                            <InfoBox default>
                                You have no wallets at that moment.&nbsp;
                                <a onClick={() => this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {})}>Log in</a>
                            </InfoBox>
                        </div>
                    }
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