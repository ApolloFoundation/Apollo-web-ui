/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import TransferHistoryItem from './transfer-history-item'
import classNames from "classnames";
import { v4 as uuidv4 } from 'uuid';
import {connect} from 'react-redux'
import InfoBox from '../../components/info-box';

import {getTransferHistory} from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getTransactionAction} from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";
import {formatTimestamp} from "../../../helpers/util/time";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'
import CustomTable from '../../components/tables/table';


const mapStateToProps = state => ({
    account: state.account.account,
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    getTransferHistory: (requestParams) => dispatch(getTransferHistory(requestParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class ScheduledTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.getAssets = this.getAssets.bind(this);
    }

    state = {
        transfers: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
    };

    componentWillMount() {
        this.getAssets({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            account: this.props.accountRS,
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getAssets({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
                account: this.props.accountRS,
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps() {

        this.getAssets({
            account: this.props.accountRS,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        })
    }

    onPaginate = (page) => {
        let reqParams = {
            ...this.props,
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15
        };

        this.setState(reqParams, () => {
            this.getAssets(reqParams)
        });
    };

    async getAssets(requestParams) {
        const transfers = await this.props.getTransferHistory(requestParams);

        if (transfers) {
            this.setState({
                ...this.props,
                transfers: transfers.transfers
            })
        }
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Transfer History'}
                />
                <div className="page-body container-fluid">
                    <CustomTable
                        header={[
                            {
                                name: 'Transaction',
                                alignRight: false
                            },{
                                name: 'Asset',
                                alignRight: false
                            },{
                                name: 'Date',
                                alignRight: false
                            },{
                                name: 'Quantity',
                                alignRight: true
                            },{
                                name: 'Recipient',
                                alignRight: false
                            },{
                                name: 'Sender',
                                alignRight: false
                            }
                        ]}
                        emptyMessage={'No asset transfer history available.'}
                        className={'mb-3'}
                        page={this.state.page}
                        TableRowComponent={TransferHistoryItem}
                        tableData={this.state.transfers}
                        isPaginate
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                        itemsPerPage={15}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledTransactions);
