/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import {setBodyModalParamsAction} from "../../../modules/modals";
import {connect} from "react-redux";
import ContentHendler from '../../components/content-hendler'
import {getFundingMonitorsAction} from '../../../actions/monitors'
import InfoBox from '../../components/info-box'
import {Link} from 'react-router-dom'
import MonitorItem from './monitor-item';

class FundingMonitors extends React.Component {

    state = {
        monitors: null,
        isLoaded: false
    }

    componentDidUpdate = () => {

        if (!this.state.isLoaded && this.props.adminPassword) {
            this.getFundingMointors({
                adminPassword: this.props.adminPassword
            })
        }
    }

    componentDidMount = () => {
        if (this.props.adminPassword) {
            this.getFundingMointors({
                adminPassword: this.props.adminPassword
            })
        } else {
            this.setState({
                monitors: {
                    errorCode: 3
                }
            })
        }

    }

    getFundingMointors = async (reqParams) => {
        const monitors = await getFundingMonitorsAction(reqParams);

        if (monitors && !monitors.errorCode) {
            this.setState({
                monitors: monitors.monitors,
                isLoaded: true
            })
        }
        if (monitors && monitors.errorCode) {
            this.setState({
                monitors,
                isLoaded: true
            })
        }
    }

    reloadFundingMonitors = () => {

        this.getFundingMointors({
            adminPassword: this.props.adminPassword
        })
    }

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Funding monitors'}
                >
                    <a className="btn btn-green btn-sm"
                       onClick={() => this.props.setBodyModalParamsAction("ADD_MONITOR", this.reloadFundingMonitors)}>
                        Add monitor
                    </a>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        {/*<div className="info-box danger">*/}
                            {/*<p>Incorrect &quot;adminPassword&quot; (locked for 1 hour, too many incorrect password*/}
                                {/*attempts)</p>*/}
                        {/*</div>*/}

                        {
                            this.state.monitors &&
                            this.state.monitors.errorCode &&
                            this.state.monitors.errorCode === 3 &&
                            <InfoBox default>
                                An admin password was not specified. Please set an admin password on the
                                <Link
                                    to={'/settings'}
                                >
                                    &nbsp;settings&nbsp;
                                </Link>
                                page.
                            </InfoBox>
                        }
                        {
                            this.state.monitors &&
                            this.state.monitors.errorCode &&
                            this.state.monitors.errorCode === 4 &&
                            <InfoBox default>
                                An admin password is incorrect. Please set an admin password on the&nbsp;
                                <Link
                                    to={'/settings'}
                                >
                                    &nbsp;settings&nbsp;
                                </Link>
                                page.
                            </InfoBox>
                        }

                        {
                            this.state.monitors &&
                            !this.state.monitors.errorCode &&
                            <ContentHendler
                                items={this.state.monitors}
                                emptyMessage={'No monitors found.'}
                            >
                                <div className="transaction-table">
                                    <div className="transaction-table-body">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Account</td>
                                                <td>Property</td>
                                                <td
                                                    className={'align-right'}
                                                >
                                                    Amount
                                                </td>
                                                <td>Threshold</td>
                                                <td>Interval</td>
                                                <td
                                                    className={'align-right'}
                                                >
                                                    Action
                                                </td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.monitors.map((el) => {
                                                    return (
                                                        <MonitorItem
                                                            reloadCallback={this.reloadFundingMonitors}
                                                            {...el}
                                                        />
                                                    );
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </ContentHendler>
                        }

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminPassword: state.account.adminPassword
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FundingMonitors);
