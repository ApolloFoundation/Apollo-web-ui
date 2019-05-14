/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import { connect } from 'react-redux';
import { setBodyModalParamsAction, setModalType } from '../../../modules/modals';
import { formatTimestamp } from "../../../helpers/util/time";
import { BlockUpdater } from "../../block-subscriber/index";
import { reloadAccountAction } from "../../../actions/login";


// Redux usage
import { getDashboardData } from '../../../actions/dashboard';

import AssetsValue from './assets-value';
import AssetPortfolio from './assets-distribution';
import AvailableBalance from './available-balance';
import CurrencyValue from './currency-value';
import ShortDescription from './short-description';

import SendApolloCard from './send-apollo-card';

import DashboardTransactions from './dashboard-transactions';
import DecentralizedMarketplace from './decentralized-market';
import ActivePolls from './active-polls';
import DashboardNews from './news';


class Dashboard extends React.Component {

	state = {
		actualBlock: null,
		account: null
	}

	listener = data => {
		this.initDashboard({ account: this.props.account });
		// this.props.reloadAccount(this.props.accountRS);
	};

	componentDidMount() {
		// this.props.getDashboardData();
		// BlockUpdater.on("data", this.listener);
		if (this.props.isShareMessage) {
			setTimeout(() => this.props.setBodyModalParamsAction("INFO_TRANSACTION", this.props.shareMessageTransaction), 500);
		}
	}

	componentWillUnmount() {
		// BlockUpdater.removeListener("data", this.listener);
		clearInterval(this.dashBoardinterval);
	}

	componentWillMount(newState) {
		// this.getBlock();
		if (this.props.account) {
			this.initDashboard({ account: this.props.account })
		}
	}

	static getDerivedStateFromProps(props, state) {
		console.log(state.account, props.account)
		// props.actualBlock !== state.actualBlock ||
		if ( props.account !== state.account) {
			debugger
			props.getDashboardData();
			return {
				actualBlock: props.actualBlock,
				account: props.account
			};
		}
	}

	initDashboard = (reqParams) => {
		this.props.getDashboardData();
	};

	render() {
		return (
			<div className="page-content">
				<SiteHeader
					pageTitle={'Dashboard'}
					dashboardPage
				/>
				<div className="page-body container-fluid full-screen-block no-padding-on-the-sides">
					<div className={'container-fluid pl-0 pr-0'}>
						<div className={'row'}>
							<div className="col-lg-3 col-md-6 pr-0 mb-3">
								<AvailableBalance />
							</div>
							<div className="col-lg-3 col-md-6 pr-0 mb-3">
								<AssetsValue />
							</div>
							<div className="col-lg-3 col-md-6 pr-0 mb-3">
								<CurrencyValue />
							</div>
							<div className="col-lg-3 col-md-6 pr-0 mb-3">
								<ShortDescription />
							</div>
						</div>
						<div className={'row'}>
							<div className="col-xl-3 col-lg-6 col-md-6 pr-0 mb-3">
								<DashboardTransactions />
							</div>
							<div className="col-xl-3 col-lg-6 col-md-6 pr-0 mb-3">
								<AssetPortfolio />
								<DecentralizedMarketplace />
							</div>
							<div className="col-xl-3 col-lg-6 col-md-6 pr-0 mb-3">
								<SendApolloCard />
								<ActivePolls />
							</div>
							<div className="col-xl-3 col-lg-6 col-md-6 pr-0 mb-3">
								<DashboardNews />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	actualBlock: state.account.actualBlock,
	account: state.account.account
})


const mapDispatchToProps = dispatch => ({
	reloadAccount: acc => dispatch(reloadAccountAction(acc)),
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
	setModalType: (type) => dispatch(setModalType(type)),
	formatTimestamp: (timestamp) => dispatch(formatTimestamp(timestamp)),

	// Redux
	getDashboardData: () => dispatch(getDashboardData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
