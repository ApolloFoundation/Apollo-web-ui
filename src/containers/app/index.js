import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import {isLoggedIn} from '../../actions/login';
import {setPageEvents} from '../../modules/account' ;
import {setBodyModalType} from '../../modules/modals' ;

// components
import SideBar from '../components/sidebar'
import ModalWindow from '../modals'

// pages components
import Dashboard from "../account/dashboard";
import Login from "../account/login";

import Transactions from '../account/transactions'
import Ledger from '../account/ledger'
import Blocks from '../account/blocks'

import ExchangeBooth from '../account/exchange-booth'
import FollowedPools from '../account/followed-pools'
import Messenger from '../account/messenger'
import ResentMarketplaceListing from '../account/marketplace/recent-listing'
import Marketplace from '../account/marketplace'
import ActivePools from '../account/active-pools'
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
import TransferHistory from '../account/transfer-history'
import Currencies from '../account/currencies'
import MyCurrencies from '../account/my-shuffling'

import style from './App.css';

class App extends React.Component {
    componentDidMount() {
        this.props.isLoggedIn();
        this.handleModal = this.handleModal.bind(this);

        console.log(this.props);
    }

    componentWillReceiveProps(newState) {
        console.log(newState);
        this.setState({...newState});
    }

    handleModal() {
        if (this.state.bodyModalType) {
            this.props.setBodyModalType(null);
        }
    }

    render() {
        return (
            <div>
                <ModalWindow/>
                <header>
                    {
                        this.props.account &&
                        <SideBar/>
                    }
                </header>

                <main ref="siteContent"
                    className={classNames({
                       'site-content': true,
                        'hide-page-body': this.props.bodyModalType
                    })}
                    onClick={this.handleModal}
                >
                    <Switch>
                        {this.props.account}

                        <Route exact path="/login" component={Login}/>

                        {!this.props.loading &&
                        <div>
                            <Route exact path="/dashboard" component={Dashboard}/>
                            <Route exact path="/" component={Dashboard}/>

                            <Route exact path="/transactions" component={Transactions}/>
                            <Route exact path="/ledger" component={Ledger}/>
                            <Route exact path="/blocks" component={Blocks}/>

                            <Route exact path="/messenger" component={Messenger}/>
                            <Route exact path="/followed-pools" component={FollowedPools}/>
                            <Route exact path="/recent-listing" component={ResentMarketplaceListing}/>
                            <Route exact path="/currencies" component={Currencies}/>
                            <Route exact path="/marketplace" component={Marketplace}/>
                            <Route exact path="/active-pools" component={ActivePools}/>
                            <Route exact path="/exchange-booth" component={ExchangeBooth}/>
                            <Route exact path="/my-shuffling" component={MyCurrencies}/>
                            <Route exact path="/account-properties" component={AccountProperties}/>
                            <Route exact path="/approval-request" component={ApprovalRequest}/>
                            <Route exact path="/asset-exchange" component={AssetExchange}/>
                            <Route exact path="/aliases" component={Aliases}/>
                            <Route exact path="/delete-history" component={DeleteHistory}/>
                            <Route exact path="/funding-monitors" component={FundingMonitors}/>
                            <Route exact path="/my-assets" component={MyAssets}/>
                            <Route exact path="/open-orders" component={OpenOrders}/>
                            <Route exact path="/peers" component={Peers}/>
                            <Route exact path="/plugins" component={Plugins}/>
                            <Route exact path="/scheduled-transactions" component={ScheduledTransactions}/>
                            <Route exact path="/settings" component={Settings}/>
                            <Route exact path="/trade-history" component={TradeHistory}/>
                            <Route exact path="/transfer-history" component={TransferHistory}/>
                        </div>}
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

    // modals
    bodyModalType: state.modals.bodyModalType
});

const mapDispatchToProps = dispatch => ({
    isLoggedIn: () => dispatch(isLoggedIn()),
    setPageEvents: () => dispatch(setPageEvents()),

    //modals
    setBodyModalType: () => dispatch(setBodyModalType())
});

export default connect(mapStateToProps, mapDispatchToProps)(App)