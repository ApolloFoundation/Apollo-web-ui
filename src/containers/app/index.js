import React from 'react';
import { Route, Link, Redirect } from 'react-router-dom'

// components
import SideBar from '../components/sidebar'

// pages components
import Dashboard from "../account/dashboard";
import Login     from "../account/login";

import Transactions from '../account/transactions'
import Ledger       from '../account/ledger'
import Blocks       from '../account/blocks'

import AccountProperties from '../account/account-properties'
import ApprovalRequest   from '../account/approval-request'
import AssetExchange     from '../account/asset-exchange'
import Aliases           from '../account/aliases'
import DeleteHistory     from '../account/delete-history'
import FundingMonitors   from '../account/funding-monitors'
import MyAssets          from '../account/my-assets'
import OpenOrders        from '../account/open-orders'
import Peers             from '../account/peers'
import Plugins               from '../account/plugins'
import ScheduledTransactions from '../account/scheduled-transactions'
import Settings              from '../account/settings'
import TradeHistory          from '../account/trade-history'
import TransferHistory       from '../account/transfer-history'

import style from  './App.css';
console.log(style);

const App = () => (
	<div>
		<header>
			<Link to="/">Home</Link>
			<Link to="/about-us">About</Link>
            <SideBar/>
		</header>
		
		<main className="site-content">
			<Route exact path="/">
                <Redirect  to="/login"/>
			</Route>
            <Route exact path="/login"                  component={Login}/>
            <Route exact path="/dashboard"              component={Dashboard}/>

			<Route exact path="/transactions"           component={Transactions}/>
            <Route exact path="/ledger"                 component={Ledger}/>
            <Route exact path="/blocks"                 component={Blocks}/>

            <Route exact path="/account-properties"     component={AccountProperties}/>
			<Route exact path="/approval-request"       component={ApprovalRequest}/>
			<Route exact path="/asset-exchange"         component={AssetExchange}/>
			<Route exact path="/aliases"                component={Aliases}/>
			<Route exact path="/delete-history"         component={DeleteHistory}/>
			<Route exact path="/funding-monitors"       component={FundingMonitors}/>
			<Route exact path="/my-assets"              component={MyAssets}/>
			<Route exact path="/open-orders"            component={OpenOrders}/>
			<Route exact path="/peers"                  component={Peers}/>
			<Route exact path="/plugins"                component={Plugins}/>
			<Route exact path="/scheduled-transactions" component={ScheduledTransactions}/>
			<Route exact path="/settings"               component={Settings}/>
			<Route exact path="/trade-history"          component={TradeHistory}/>
			<Route exact path="/transfer-history"       component={TransferHistory}/>
		</main>
	</div>
);

export default App;