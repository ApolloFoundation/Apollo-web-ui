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
import TalkToUs from './talk-to-us';


class Dashboard extends React.Component {
	state = {
		actualBlock: null,
		account: null
	};

	componentDidMount() {
		if (this.props.isShareMessage) {
			setTimeout(() => this.props.setBodyModalParamsAction("INFO_TRANSACTION", this.props.shareMessageTransaction), 500);
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props.actualBlock !== state.actualBlock || props.account !== state.account) {
			props.getDashboardData();
			return {
				actualBlock: props.actualBlock,
				account: props.account
			};
		}
	}

	initDashboard = () => {
		this.props.getDashboardData();
	};

	render() {
		return (
			<div className="page-content">
				<SiteHeader
					pageTitle={'Dashboard'}
					dashboardPage
				/>
				<div className="page-body container-fluid full-screen-block">
					<div className={'container-fluid pl-0 pr-0'}>
						<div className={'row'}>
							<div className="col-lg-3 col-md-6 p-0 mb-3">
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
							<div className="col-xl-3 col-lg-6 col-md-6 p-0 mb-3">
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
								<TalkToUs />
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
