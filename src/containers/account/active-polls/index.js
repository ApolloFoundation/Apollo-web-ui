/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import {getpollsAction} from '../../../actions/polls';
import PoolItem from './pool-item';
import uuid from "uuid";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {withRouter} from 'react-router-dom';
import InfoBox from '../../components/info-box';
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getpollsAction: (reqParams) => dispatch(getpollsAction(reqParams)),
    getAliasesAction: (reqParams) => dispatch(getAliasesAction(reqParams)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


class Activepolls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 14,
            page: 1,
            activepolls: null,
            finishedpolls: null
        };
    }

    listener = data => {
        this.getActivepolls();

        this.getFinishedpolls({
            firstIndex: 0,
            lastIndex:  9,
        });
    };

    componentDidMount() {
        this.getActivepolls();

        this.getFinishedpolls({
            firstIndex: 0,
            lastIndex:  9,
        });
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };

    componentWillReceiveProps(newState) {
        this.getActivepolls();
        this.getFinishedpolls({
            firstIndex: 0,
            lastIndex:  9,
        });
    }

    getActivepolls = async (reqParams) => {
        reqParams = {
            ...reqParams,
            includeFinished: false,
        };

        const activepolls = await this.props.getpollsAction(reqParams);

        if (activepolls) {
            this.setState({
                ...this.props,
                activepolls: activepolls.polls
            });
        }
    }

    getFinishedpolls = async (reqParams) => {
        reqParams = {
            ...reqParams,
            finishedOnly: true
        };

        const finishedpolls = await this.props.getpollsAction(reqParams);

        if (finishedpolls) {
            this.setState({
                ...this.props,
                finishedpolls: finishedpolls.polls
            });
        }
    }

    handleGoToFinishedPolls = () => {
        this.props.history.push('/finished-polls')
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active polls'}
                />
                <div className="page-body container-fluid">
                    <div className="active-polls white-space">
                        <CustomTable 
                            header={[
                                {
                                    name: 'Title',
                                    alignRight: false
                                },{
                                    name: 'Description',
                                    alignRight: false
                                },{
                                    name: 'Sender',
                                    alignRight: false
                                },{
                                    name: 'Start date',
                                    alignRight: false
                                },{
                                    name: 'Blocks left',
                                    alignRight: false
                                },{
                                    name: 'Actions',
                                    alignRight: true
                                }
                            ]}
                            className={'no-min-height'}
                            emptyMessage={'No active polls.'}
                            TableRowComponent={PoolItem}
                            tableData={this.state.activepolls}
                        />

                        <div className="transaction-table no-min-height">
                                
                        </div>

                        <div className="form-group-app offset-bottom height-auto no-padding transparent">
                            <CustomTable 
                                tableName={'Finished polls'}
                                header={[
                                    {
                                        name: 'Title',
                                        alignRight: false
                                    },{
                                        name: 'Description',
                                        alignRight: false
                                    },{
                                        name: 'Sender',
                                        alignRight: false
                                    },{
                                        name: 'Start date',
                                        alignRight: false
                                    },{
                                        name: 'Blocks left',
                                        alignRight: false
                                    },{
                                        name: 'Actions',
                                        alignRight: true
                                    }
                                ]}
                                className={'no-min-height pb-0'}
                                emptyMessage={'No finished polls.'}
                                TableRowComponent={PoolItem}
                                tableData={this.state.finishedpolls}
                                hintClassName={'mt-4'}
                                actionButton={{
                                    name:'View All',
                                    handler: this.handleGoToFinishedPolls
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Activepolls));