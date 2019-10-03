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
import BlockchainStatus from "./BlockchainStatus";
import SendApollo from "./SendApollo";
import MyTransactions from "./MyTransactions";
import StayInTouch from "./StayInTouch";
import ActivePolls from "./ActivePolls";
import InfoStatistic from "./InfoStatistic";

import TwitterBanner from "../../../assets/why-apollo.png";
import InfoBanner from "../../../assets/new-vision-2020.png";

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
                    <div className={'container-fluid p-0'}>
                        <div className={'cards-wrap row'}>
                            <div className={'col-lg-3 col-md-4 col-sm-12 p-0'}>
                                <div className={'d-flex flex-column'}>
                                    <TotalBalance/>
                                    <MyTransactions/>
                                </div>
                            </div>
                            <div className={'col-lg-9 col-md-8 col-sm-12 p-0'}>
                                <div className={'row'}>
                                    <div className={'col-lg-8 p-0'}>
                                        <div className={'row'}>
                                            <div className={'col-sm-6 p-0'}>
                                                <div className={'d-flex flex-column'}>
                                                    <BlockchainStatus/>
                                                    <ActivePolls/>
                                                </div>
                                            </div>
                                            <div className={'col-sm-6 p-0 d-flex'}>
                                                <SendApollo/>
                                            </div>
                                        </div>
                                        <a
                                            href={'https://medium.com/@apollocurrency'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`card card-square card-xl`}
                                            style={{backgroundImage: `url(${InfoBanner})`}}
                                        />
                                    </div>
                                    <div className={'col-lg-4 p-0'}>
                                        <div className={'d-flex flex-column'}>
                                            <InfoStatistic/>
                                            <StayInTouch/>
                                            <a
                                                href={'https://twitter.com/ApolloCurrency'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`card card-square`}
                                                style={{backgroundImage: `url(${TwitterBanner})`}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
