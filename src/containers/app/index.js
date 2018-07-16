import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import {isLoggedIn} from '../../actions/login';
import {setPageEvents} from '../../modules/account' ;
// components
import SideBar from '../components/sidebar'
// pages components
import Dashboard from "../account/dashboard";
import Login from "../account/login";

import Transactions from '../account/transactions'
import Ledger from '../account/ledger'
import Blocks from '../account/blocks'

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

import style from './App.css';

console.log(style);

class App extends React.Component {
    componentDidMount() {
        this.props.isLoggedIn();
        this.handleModal = this.handleModal.bind(this);
    }

    componentWillReceiveProps(newState) {
        console.log(newState);
        this.setState({...newState});
    }

    handleModal(e, param) {
        this.props.setPageEvents(param, e.target);
    }

    render() {
        return (
            <div>
                <header>
                    {
                        this.props.account &&
                        <SideBar/>
                    }
                </header>

                <main ref="siteContent"
                    className={classNames({
                       'site-content': true,
                       'overflow-content': this.props.blockPageBody
                    })}
                    onClick={(e) => this.handleModal(e, false)}
                >
                    <Switch>
                        {this.props.account}

                        <Route exact path="/login" component={Login}/>

                        {!this.props.loading &&
                        <div>
                            <Route exact path="/dashboard" component={Dashboard}/>

                            <Route exact path="/transactions" component={Transactions}/>
                            <Route exact path="/ledger" component={Ledger}/>
                            <Route exact path="/blocks" component={Blocks}/>

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
    blockPageBody: state.account.blockPageBody
});

const mapDispatchToProps = dispatch => ({
    isLoggedIn: () => dispatch(isLoggedIn()),
    setPageEvents: () => dispatch(setPageEvents())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);