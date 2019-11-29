/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import {getpollsAction} from '../../../actions/polls';
import {getAliasesAction} from "../../../actions/aliases";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import PoolItem from './pool-item';
import {BlockUpdater} from "../../block-subscriber";


const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getpollsAction: (reqParams) => dispatch(getpollsAction(reqParams)),
    getAliasesAction: (reqParams) => dispatch(getAliasesAction(reqParams)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class Activepolls extends React.Component {
    state = {
        activepolls: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
    };

    listener = data => {
        this.getActivePolls({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    componentDidMount() {
        this.getActivePolls({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };

    getActivePolls = async (reqParams, pagination) => {
        reqParams = {
            ...reqParams,
            includeFinished: false,
        };

        const activepolls = await this.props.getpollsAction(reqParams);

        if (activepolls) {
            this.setState({
                ...pagination,
                activepolls: activepolls.polls
            });
        }
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        };
        this.getActivePolls({
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        }, pagination);
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active polls'}
                />
                <div className="page-body container-fluid">
                    <CustomTable
                        header={[
                            {
                                name: 'Title',
                                alignRight: false
                            }, {
                                name: 'Description',
                                alignRight: false
                            }, {
                                name: 'Sender',
                                alignRight: false
                            }, {
                                name: 'Start date',
                                alignRight: false
                            }, {
                                name: 'Blocks left',
                                alignRight: false
                            }, {
                                name: 'Actions',
                                alignRight: true
                            }
                        ]}
                        className={'no-min-height mb-3'}
                        emptyMessage={'No active polls.'}
                        TableRowComponent={PoolItem}
                        tableData={this.state.activepolls}
                        isPaginate
                        page={this.state.page}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                        itemsPerPage={15}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Activepolls));
