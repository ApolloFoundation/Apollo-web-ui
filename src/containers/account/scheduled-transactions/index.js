/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import InfoBox from "../../components/info-box";
import {Link} from "react-router-dom";
import {connect} from 'react-redux'
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getScheduledTransactions} from "../../../actions/scheduled-transactions";
import ContentHendler from "../../components/content-hendler";
import classNames from "classnames";
import TransactionItem from '../transactions/transaction';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

const mapStateToProps = state => ({
    adminPassword: state.account.adminPassword,
    account: state.account.account,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

class ScheduledTransactions extends React.Component {
    state = {
        scheduledTransactions: null,
    }

    componentDidUpdate = () => {
        if (!this.state.isLoaded && this.props.account &&  (this.props.adminPassword || this.props.adminPassword === '')) {
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
    };

    reloadSceduledTransactions = () => {

        this.getScheduledTransactions({
            adminPassword: this.state.adminPassword
        })
    };

    deleteScheduledTransaction = async (transaction) => {
        const deleteTransacrtio = await this.props.submitForm({adminPassword : this.props.adminPassword , transaction}, 'deleteScheduledTransaction');

        if (deleteTransacrtio) {
            if (deleteTransacrtio.errorCode) {
                NotificationManager.error(deleteTransacrtio.errorDescription, 'Error', 5000);

            } else {
                NotificationManager.success('Scheduled transaction has been deleted!', null, 5000);
                this.reloadSceduledTransactions();
            }
        }
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Scheduled transactions'}
                >
                    <a
                        className={classNames({
                            'btn': true,
                            'primary': true,
                            'disabled' : this.state.isPrivate
                        })}
                        onClick={() => this.props.setBodyModalParamsAction('SCHEDULE_CURRENCY', this.reloadSceduledTransactions)}
                    >
                        Schedule currency
                    </a>
                </SiteHeader>

                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
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
                        <ContentHendler
                            items={this.state.scheduledTransactions}
                            emptyMessage={'No schedules found.'}
                        >
                            <div className="transaction-table">
                                <div className="transaction-table-body">
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>Date</td>
                                                <td>Type</td>
                                                <td className="align-right">Amount</td>
                                                <td className="align-right">Fee</td>
                                                <td>Account</td>
                                                <td className="align-right">Height</td>
                                                <td className="align-right">Actions</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.scheduledTransactions &&
                                            this.state.scheduledTransactions.length > 0 &&
                                            this.state.scheduledTransactions.map((el) => {
                                                return (
                                                    <TransactionItem
                                                        transaction={el}
                                                        isScheduled
                                                        deleteSheduledTransaction={this.deleteScheduledTransaction}
                                                    />
                                                )
                                            })

                                        }
                                        </tbody>
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