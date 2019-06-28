/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header';
import {setBodyModalParamsAction, setModalType} from '../../../modules/modals';
import {formatTimestamp} from "../../../helpers/util/time";
import {reloadAccountAction} from "../../../actions/login";
import {getDashboardData} from '../../../actions/dashboard';

import TotalBalance from "./TotalBalance";
import SendApollo from "./SendApollo";
import MyTransactions from "./MyTransactions";
import StayInTouch from "./StayInTouch";

import TwitterBanner from "../../../assets/twitter-banner.png";
import InfoBanner from "../../../assets/info-banner.png";
import './style.scss';

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
                <div className="page-body dashboard">
                    <div className={'container-fluid'}>
                        <div className={'cards-wrap'}>
                            <TotalBalance/>
                            <SendApollo/>
                            <MyTransactions/>
                        </div>
                        <div className={'cards-wrap'}>
                            <a
                                href={'https://twitter.com/ApolloCurrency'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`card card-square`}
                                style={{backgroundImage: `url(${TwitterBanner})`}}
                            />
                            <a
                                href={'https://twitter.com/ApolloCurrency'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`card card-square card-xl`}
                                style={{backgroundImage: `url(${InfoBanner})`}}
                            />
                            <StayInTouch/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    actualBlock: state.account.actualBlock,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    reloadAccount: acc => dispatch(reloadAccountAction(acc)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    setModalType: (type) => dispatch(setModalType(type)),
    formatTimestamp: (timestamp) => dispatch(formatTimestamp(timestamp)),
    getDashboardData: () => dispatch(getDashboardData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
