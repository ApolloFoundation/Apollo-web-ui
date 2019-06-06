/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import {getAccountShufflingsAction} from '../../../actions/shuffling';
import {getTransactionAction} from '../../../actions/transactions';
import ShufflingItem from './shuffling-item/'
import submitForm from '../../../helpers/forms/forms';
import {BlockUpdater} from '../../block-subscriber/index';
import {setBodyModalParamsAction} from '../../../modules/modals';


const initialPagination = {
    page: 1,
    firstIndex: 0,
    lastIndex: 14,
};

class MyShufling extends React.Component {
    state = {
        ...initialPagination,
        shufflings: null,
    };

    componentDidMount() {
        this.getAccountShufflings({
            account: this.props.account,
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getAccountShufflings({
                account: this.props.account,
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps(newState) {
        this.getAccountShufflings({
            account: newState.account
        });
    }

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15 - 1
        };
        this.getAccountShufflings({
            account: this.props.account
        }, pagination);
    };

    getAccountShufflings = async (reqParams, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
            }
        }
        const shufflings = await this.props.getAccountShufflingsAction({
            account: reqParams.account,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });

        if (shufflings) {
            this.setState({
                ...pagination,
                shufflings: shufflings.shufflings
            });
        }
    };

    getShufflers = async () => {
        const res = await this.props.submitForm({}, 'getShufflers');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Transaction has been submitted!', null, 5000);
        }
    };

    getTransaction = async (data) => {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My shuffling'}
                />
                <div className="page-body container-fluid">
                    <CustomTable
                        header={[
                            {
                                name: 'Shuffling',
                                alignRight: false
                            }, {
                                name: 'Stage',
                                alignRight: false
                            }, {
                                name: 'Holding',
                                alignRight: false
                            }, {
                                name: 'Amount',
                                alignRight: false
                            }, {
                                name: 'Blocks Remaining',
                                alignRight: false
                            }, {
                                name: 'Participants',
                                alignRight: true
                            }, {
                                name: 'Assignee',
                                alignRight: true
                            }
                        ]}
                        className={'no-min-height mb-3'}
                        emptyMessage={'No shufflings found.'}
                        TableRowComponent={ShufflingItem}
                        tableData={this.state.shufflings}
                        passProps={{getTransaction: this.getTransaction}}
                        isPaginate
                        page={this.state.page}
                        previousHendler={() => this.onPaginate(this.state.page - 1)}
                        nextHendler={() => this.onPaginate(this.state.page + 1)}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getAccountShufflingsAction: (requestParams) => dispatch(getAccountShufflingsAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyShufling);
