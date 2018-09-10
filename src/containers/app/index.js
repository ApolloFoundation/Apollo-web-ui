import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import {isLoggedIn, getConstantsAction} from '../../actions/login';
import {setPageEvents, loadConstants} from '../../modules/account' ;
import {setBodyModalType} from '../../modules/modals' ;
import PageLoader from '../components/page-loader/page-loader';
import {NotificationContainer} from 'react-notifications';
// components
import SideBar from '../components/sidebar'
import ModalWindow from '../modals'
import AlertBox from '../components/alert-box'

// pages components
import Dashboard from "../account/dashboard";
import Login from "../account/login";

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
import ApprovalRequest from '../account/approval-request'
import AssetExchange from '../account/asset-exchange'
import Aliases from '../account/aliases'
import DeleteHistory from '../account/delete-history'
import FundingMonitors from '../account/funding-monitors'
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
import Finishedpolls from '../account/finished-polls'
import MyVotes from '../account/my-votes'
import MyPolls from '../account/my-polls'
import DataStorage from "../account/datastorage";
import ActiveShufflings   from "../account/active-shufflings";
import FinishedShufflings from "../account/finished-shufflings";
import MyMessages from "../account/my-messages";
import MarketplaceSearch from "../account/marketplace-search";
import Generators from "../account/generators"
import style from './App.css';
import converters from "../../helpers/converters";
import crypto from '../../helpers/crypto/crypto';


class App extends React.Component {
    componentDidMount() {
        this.props.isLoggedIn();
        this.props.getConstantsAction();
        this.handleModal = this.handleModal.bind(this);
        this.setState({
            isMounted: true
        })
    }

    state = {
        isMounted: false
    }

    componentWillReceiveProps(newState) {
        this.setState({...newState});
    }

    handleModal = (e) => {
        const parents = e.target.closest('.settings-bar') || null;

        if (!parents) {
            if (this) {

                if (this.state.bodyModalType) {
                    this.props.setBodyModalType(null);
                }
            }
        }
    };

    render() {
        return (
            <div>
                <NotificationContainer/>
                <ModalWindow/>
                <AlertBox/>
                <header>
                    {
                        this.props.account &&
                        <SideBar
                            match={this.props.match}
                            location={this.props.location}
                        />
                    }
                </header>

                <main ref="siteContent"
                    className={classNames({
                       'site-content': true,
                        'hide-page-body': this.props.bodyModalType
                    })}
                    onClick={(e) => this.handleModal(e)}
                >
                    <Switch>
                        {this.props.account}

                        <Route exact path="/login" component={Login}/>

                        {!this.props.loading &&
                            [
                                <Route exact path="/dashboard" component={Dashboard}/>
                                ,<Route exact path="/" component={Dashboard}/>

                                ,<Route exact path="/transactions" component={Transactions}/>
                                ,<Route exact path="/ledger" component={Ledger}/>
                                ,<Route exact path="/blocks" component={Blocks}/>

                                ,<Route path="/followed-polls/:poll" component={Followedpolls}/>
                                ,<Route path="/followed-polls" component={Followedpolls}/>
                                ,<Route exact path="/my-votes" component={MyVotes}/>
                                ,<Route exact path="/my-polls" component={MyPolls}/>
                                ,<Route exact path="/messenger" component={Messenger}/>
                                ,<Route exact path="/recent-listing" component={ResentMarketplaceListing}/>
                                ,<Route exact path="/currencies" component={Currencies}/>
                                ,<Route exact path="/marketplace/" component={Marketplace}/>
                                ,<Route exact path="/my-products-for-sale" component={MyProductsForSale}/>
                                ,<Route exact path="/my-panding-orders" component={MyPandingOrders}/>
                                ,<Route exact path="/my-completed-orders" component={MyCompletedOrders}/>
                                ,<Route exact path="/marketplace/:tag" component={MarketplaceSearch}/>
                                ,<Route exact path="/active-polls" component={Activepolls}/>
                                ,<Route exact path="/active-shuffling" component={ActiveShufflings}/>
                                ,<Route path="/exchange-booth/:currency" component={ExchangeBooth}/>
                                ,<Route exact path="/my-shuffling" component={MyCurrencies}/>
                                ,<Route exact path="/account-properties" component={AccountProperties}/>
                                ,<Route exact path="/approval-request" component={ApprovalRequest}/>
                                ,<Route exact path="/asset-exchange/:asset" component={AssetExchange}/>
                                ,<Route exact path="/aliases" component={Aliases}/>
                                ,<Route exact path="/delete-history" component={DeleteHistory}/>
                                ,<Route exact path="/funding-monitors" component={FundingMonitors}/>
                                ,<Route exact path="/my-assets" component={MyAssets}/>
                                ,<Route exact path="/open-orders" component={OpenOrders}/>
                                ,<Route exact path="/peers" component={Peers}/>
                                ,<Route exact path="/purchased-products" component={PurchasdProucts}/>
                                ,<Route exact path="/plugins" component={Plugins}/>
                                ,<Route exact path="/scheduled-transactions" component={ScheduledTransactions}/>
                                ,<Route exact path="/settings" component={Settings}/>
                                ,<Route exact path="/trade-history" component={TradeHistory}/>
                                ,<Route exact path="/trade-history-currency" component={TradeHistoryCurrency}/>
                                ,<Route exact path="/transfer-history" component={TransferHistory}/>
                                ,<Route exact path="/transfer-history-currency" component={TransferHistoryCurrency}/>
                                ,<Route exact path="/finished-polls" component={Finishedpolls}/>
                                ,<Route exact path="/data-storage" component={DataStorage}/>
                                ,<Route exact path="/finished-shuffling" component={FinishedShufflings}/>
                                ,<Route exact path="/my-messages" component={MyMessages}/>
                                ,<Route exact path="/generators" component={Generators}/>
                            ]
                        }
                    </Switch>
                </main>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    account: state.account.account,
    loading: state.account.loading,
    blockPageBody: state.account.blockPageBody,
    constants: state.account.constants,

    // modals
    bodyModalType: state.modals.bodyModalType
});

const mapDispatchToProps = dispatch => ({
    isLoggedIn: () => dispatch(isLoggedIn()),
    setPageEvents: () => dispatch(setPageEvents()),
    getConstantsAction: () => dispatch(getConstantsAction()),

    //modals
    setBodyModalType: () => dispatch(setBodyModalType())
});

export default connect(mapStateToProps, mapDispatchToProps)(App)