/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import classNames from 'classnames';
import {isLoggedIn, getConstantsAction} from '../../actions/login';
import {setPageEvents, loadConstants} from '../../modules/account' ;
import {setBodyModalType} from '../../modules/modals' ;
import PageLoader from '../components/page-loader/page-loader';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactHintFactory from 'react-hint';

// components
import SideBar from '../components/sidebar';
import ModalWindow from '../modals';
import AlertBox from '../components/alert-box';
import BlocksDownloader from '../components/blocks-downloader';
import {getSavedAccountSettingsAction, saveAccountSettingsAction} from "../../modules/accountSettings";

// pages components
import Dashboard from "../account/dashboard";
import Login from "../account/login";
import Faucet from "../account/faucet";

import Transactions from '../account/transactions'
import Ledger from '../account/ledger'
import Blocks from '../account/blocks'

import ExchangeBooth from '../account/exchange-booth'
import Followedpolls from '../account/followed-polls'
import Messenger from '../account/messenger'
import ResentMarketplaceListing from '../account/marketplace/recent-listing'
import Marketplace from '../account/marketplace'
import MyProductsForSale from '../account/my-products-for-sale'
import MyPandingOrders from '../account/my-panding-orders'
import PurchasdProucts from '../account/purchased-proucts'
import MyCompletedOrders from '../account/my-completed-orders'
import Activepolls from '../account/active-polls'
import AccountProperties from '../account/account-properties'
import Assets from '../account/assets'
import ApprovalRequest from '../account/approval-request'
import ApprovalRequestAssets from '../account/approval-request-assets'
import AssetExchange from '../account/asset-exchange'
import Aliases from '../account/aliases'
import DeleteHistory from '../account/delete-history'
import FundingMonitors from '../account/funding-monitors'
import FundingMonitorsStatus from '../account/funding-monitors-status'
import MyAssets from '../account/my-assets'
import OpenOrders from '../account/open-orders'
import Peers from '../account/peers'
import Plugins from '../account/plugins'
import ScheduledTransactions from '../account/scheduled-transactions'
import Settings from '../account/settings'
import TradeHistory from '../account/trade-history'
import TradeHistoryCurrency from '../account/trade-history-currency'
import TransferHistory from '../account/transfer-history'
import TransferHistoryCurrency from '../account/transfer-history-currency'
import Currencies from '../account/currencies'
import MyCurrencies from '../account/my-shuffling'
import MyMadedCurrencies from '../account/my-currencies'
import Finishedpolls from '../account/finished-polls'
import MyVotes from '../account/my-votes'
import MyPolls from '../account/my-polls'
import DataStorage from "../account/datastorage";
import ActiveShufflings from "../account/active-shufflings";
import FinishedShufflings from "../account/finished-shufflings";
import MyMessages from "../account/my-messages";
import MarketplaceSearch from "../account/marketplace-search";
import Generators from "../account/generators"
import Exchange from "../account/exchange/dashboard"
import OrderHistory from "../account/exchange/order-history"
import ChooseWallet from "../account/exchange/choose-wallet"

import './App.scss';
import './fonts.scss';

import {getUpdateStatus} from '../../actions/login/index'
import urlHelper from "../../helpers/util/urlParser";
import {startBlockPullingAction} from '../../actions/blocks'
import './window';
import {setBodyModalParamsAction} from "../../modules/modals";

import UnknownPage from '../account/404'
import {loginWithShareMessage} from "../../actions/account";

const ReactHint = ReactHintFactory(React)

class App extends React.Component {

    shareMessage = false;

    componentDidMount() {
        const {
                getSavedAccountSettings,
                isLoggedIn,
                getConstantsAction
            } = this.props;

        getSavedAccountSettings();
        this.checkUrl();
        // this.props.startBlockPullingAction();
        getUpdateStatus();
        if (!this.shareMessage) {
            isLoggedIn(this.props.history);
        }
        getConstantsAction();
        this.setState({
            isMounted: true
        })


        // Hints settings
        window.ReactHint = ReactHint;
    }

    state = {
        isMounted: false
    };

    componentWillReceiveProps(newState) {
        this.setState({...newState});
    }

    // handleModal = (e) => {
    //     const parents = e.target.closest('.settings-bar') || null;

    //     if (!parents) {
    //         if (this) {

    //             if (this.state.bodyModalType) {
    //                 this.props.setBodyModalType(null);
    //             }
    //         }
    //     }
    // };

    checkUrl = () => {
        const params = urlHelper.parseUrl();
        if (params.isShareMessage) {
            this.shareMessage = true;
            const account = params.account;
            const transaction = params.transaction;
            this.props.loginWithShareMessage(account, transaction);
        }
    };

    onRenderContent = (target, content) => {
        let {catId} = target.dataset
        catId = JSON.parse(catId);
 
        if (catId && catId.infoContent) {
            return  <div className="custom-hint__content">
                        <div
                            className="phased-transaction"
                        >
                            <div className="phasing-box__phasing-description p-3">
                                {catId.infoContent}
                            </div>
                        </div>
                    </div>

        } else {
            return  <div className="custom-hint__content">
                    <div
                        className="phased-transaction"
                    >
                        <div className="phasing-box__phasing-description">
                            <table>
                                <tbody>
                                {
                                    catId &&
                                    <React.Fragment>
                                        <tr>
                                            <td>Accounts: </td>
                                            <td>{catId.quorum}</td>

                                        </tr>
                                        <tr>
                                            <td>Votes: </td>
                                            <td>{catId.result}</td>
                                        </tr>
                                        <tr>
                                            <td>Percentage: </td>
                                            <td>
                                                {
                                                    (catId.result / catId.quorum) * 100
                                                } %
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Finish Height</td>
                                            <td>{catId.finishHeight}</td>
                                        </tr>
                                        <tr>
                                            <td>Approved: </td>
                                            <td>
                                                {
                                                    catId.approved ? 'Yes' : 'No'
                                                }
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        }
        
    }

    routers = () => (
        <Switch>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/" component={Dashboard}/>
            <Route exact path="/transactions" component={Transactions}/>
            <Route exact path="/ledger" component={Ledger}/>
            <Route exact path="/blocks" component={Blocks}/>
            <Route exact path="/followed-polls/:poll" component={Followedpolls}/>
            <Route exact path="/followed-polls" component={Followedpolls}/>
            <Route exact path="/my-votes" component={MyVotes}/>
            <Route exact path="/my-polls" component={MyPolls}/>
            <Route exact path="/messenger" component={Messenger}/>
            <Route exact path="/messenger/:chat" component={Messenger}/>
            <Route exact path="/recent-listing" component={ResentMarketplaceListing}/>
            <Route exact path="/currencies" component={Currencies}/>
            <Route exact path="/marketplace/" component={Marketplace}/>
            <Route exact path="/my-products-for-sale" component={MyProductsForSale}/>
            <Route exact path="/my-pending-orders" component={MyPandingOrders}/>
            <Route exact path="/my-completed-orders" component={MyCompletedOrders}/>
            <Route exact path="/marketplace/:tag" component={MarketplaceSearch}/>
            <Route exact path="/active-polls" component={Activepolls}/>
            <Route exact path="/active-shuffling" component={ActiveShufflings}/>
            <Route exact path="/exchange-booth/:currency" component={ExchangeBooth}/>
            <Route exact path="/my-shuffling" component={MyCurrencies}/>
            <Route exact path="/account-properties" component={AccountProperties}/>
            <Route exact path="/approval-request" component={ApprovalRequest}/>
            <Route exact path="/approval-request-assets" component={ApprovalRequestAssets}/>
            <Route exact path="/asset-exchange/:asset" component={AssetExchange}/>
            <Route exact path="/asset-exchange" component={AssetExchange}/>
            <Route exact path="/all-assets" component={Assets}/>
            <Route exact path="/aliases" component={Aliases}/>
            <Route exact path="/delete-history" component={DeleteHistory}/>
            <Route exact path="/funding-monitors" component={FundingMonitors}/>
            <Route exact path="/funding-monitors/:account/:property" component={FundingMonitorsStatus}/>
            <Route exact path="/my-assets" component={MyAssets}/>
            <Route exact path="/my-currencies" component={MyMadedCurrencies}/>
            <Route exact path="/open-orders" component={OpenOrders}/>
            <Route exact path="/peers" component={Peers}/>
            <Route exact path="/purchased-products" component={PurchasdProucts}/>
            {/*,<Route exact path="/plugins" component={Plugins}/>*/}
            <Route exact path="/scheduled-transactions" component={ScheduledTransactions}/>
            <Route exact path="/settings" component={Settings}/>
            <Route exact path="/trade-history" component={TradeHistory}/>
            <Route exact path="/exchange-history-currency" component={TradeHistoryCurrency}/>
            <Route exact path="/transfer-history" component={TransferHistory}/>
            <Route exact path="/transfer-history-currency" component={TransferHistoryCurrency}/>
            <Route exact path="/finished-polls" component={Finishedpolls}/>
            <Route exact path="/data-storage" component={DataStorage}/>
            <Route exact path="/data-storage/:query" component={DataStorage}/>
            <Route exact path="/finished-shuffling" component={FinishedShufflings}/>
            <Route exact path="/my-messages" component={MyMessages}/>
            <Route exact path="/generators" component={Generators}/>
            <Route exact path="/exchange" component={Exchange}/>
            <Route exact path="/order-history" component={OrderHistory}/>
            <Route exact path="/choose-wallet" component={ChooseWallet}/>

            <Route exact path="/index.html" render={() => <Redirect to="/dashboard"/>}/>
            <Route exact path="*" render={() => <Redirect to="/dashboard"/>}/>
        </Switch>
    )

    render() {
        const {
            history: {
                location: 
                {
                    pathname
                }
            }
        } = this.props;

        const isLoginPage = pathname === '/login' || pathname === '/faucet';

        return (
            <div
                className={classNames({
                    'overflow-hidden': this.props.modalType
                })}
            >
                <NotificationContainer/>
                <ModalWindow/>
                <AlertBox/>
                <ReactHint 
                    persist
                    attribute="data-custom"
                    className="custom-hint"
                    events={{hover: true}}
                    onRenderContent={this.onRenderContent}
                    ref={(ref) => this.instance = ref} 
                />
                <header>
                    {
                        this.props.location.pathname !== "/faucet" &&
                        this.props.location.pathname !== "/login" &&
                        this.props.account &&
                        <SideBar
                            match={this.props.match}
                            location={this.props.location}
                        />
                    }
                </header>

                <div ref="siteContent"
                     className={classNames({
                         'site-content': true,
                         'login-page':  isLoginPage,
                         'hide-page-body': this.props.bodyModalType
                     })}
                >
                    {this.props.isLocalhost && this.props.blockchainStatus && (
                        <BlocksDownloader/>
                    )}
                    
                    <Switch>
                        <Route exact path="/faucet" component={Faucet}/>
                        <Route exact path="/login" render={() => (
                            !!this.props.account ? (
                                <Redirect to="/dashboard"/>
                            ) : (
                                <Route exact path="/login" component={Login}/>
                            )
                        )}/>


                        {
                            !!this.props.account &&
                            !this.props.loading &&
                            <>
                                {this.routers()}
                            </> ||
                            <>
                                <PageLoader />
                            </>
                        }
                    </Switch>
                    {
                        !this.props.loading && !isLoginPage &&
                        <div className="site-footer">
                            Copyright © 2017-2019 Apollo Foundation.
                            <br className={'show-media hide-desktop'}/>
                            Apollo Version: {!!this.props.appState && this.props.appState.version} <br/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    account: state.account.account,
    loading: state.account.loading,
    blockPageBody: state.account.blockPageBody,
    constants: state.account.constants,
    appState: state.account.blockchainStatus,

    // modals
    modalType: state.modals.modalType,
    isLocalhost: state.account.isLocalhost,
    blockchainStatus: state.account.blockchainStatus,
    bodyModalType: state.modals.bodyModalType
});

const mapDispatchToProps = dispatch => ({
    isLoggedIn: (history) => dispatch(isLoggedIn(history)),
    setPageEvents: () => dispatch(setPageEvents()),
    getConstantsAction: () => dispatch(getConstantsAction()),
    getSavedAccountSettings: () => dispatch(getSavedAccountSettingsAction()),
    loginWithShareMessage: (account, transaction) => dispatch(loginWithShareMessage(account, transaction)),
    loadConstants: () => dispatch(loadConstants()),
    
    //modals
    setBodyModalType: () => dispatch(setBodyModalType()),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    startBlockPullingAction: () => dispatch(startBlockPullingAction())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));