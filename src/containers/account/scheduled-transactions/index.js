/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import ContentLoader from '../../components/content-loader'
import InfoBox from "../../components/info-box";
import {Link} from "react-router-dom";
import {connect} from 'react-redux'
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getScheduledTransactions} from "../../../actions/scheduled-transactions";
import ContentHendler from "../../components/content-hendler";

const mapStateToProps = state => ({
    adminPassword: state.account.adminPassword,
    account: state.account.account,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class ScheduledTransactions extends React.Component {
    state = {
        scheduledTransactions: null
    }

    componentDidUpdate = () => {

        if (!this.state.isLoaded && this.props.account &&  this.props.adminPassword) {
            this.getScheduledTransactions({
                adminPassword: this.props.adminPassword,
                account: this.props.account
            })
        }
    };

    componentDidMount = () => {
        if (this.props.adminPassword) {
            this.getScheduledTransactions({
                adminPassword: this.props.adminPassword,
                account: this.props.account
            })
        } else {
            this.setState({
                monitors: {
                    errorCode: 3
                }
            })
        }
    };

    getScheduledTransactions = async (reqParams) => {
        const scheduledTransactions = await getScheduledTransactions(reqParams);

        console.log(scheduledTransactions);

        if (scheduledTransactions && !scheduledTransactions.errorCode) {
            this.setState({
                scheduledTransactions: scheduledTransactions.scheduledTransactions,
                isLoaded: true
            })
        }
        if (scheduledTransactions && scheduledTransactions.errorCode) {
            this.setState({
                scheduledTransactions,
                isLoaded: true
            })
        }
    }


    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Scheduled transactions'}
                />

                {
                    this.state.scheduledTransactions &&
                    this.state.scheduledTransactions.errorCode &&
                    this.state.scheduledTransactions.errorCode === 3 &&
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

                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <ContentHendler
                            items={this.state.scheduledTransactions}
                            emptyMessage={'No schedules found.'}
                        >
                            <div className="transaction-table">
                                <div className="transaction-table-body">
                                    <table>

                                    </table>
                                </div>
                            </div>
                        </ContentHendler>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledTransactions);