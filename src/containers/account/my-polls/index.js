/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getMyPollsAction, getVoteAction} from '../../../actions/polls';
import PoolItem from '../active-polls/pool-item';
import uuid from "uuid";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";

import CustomTable from '../../components/tables/table';


const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getMyPollsAction: (reqParams) => dispatch(getMyPollsAction(reqParams)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
    getVoteAction:     (requestParams) => dispatch(getVoteAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


class MyVotes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 15,
            page: 1,
            myPolls: null
        };

        // this.getVote  = this.getVote.bind(this);
    }

    componentDidMount() {
        this.getMyPolls({
            account: this.props.account,
            includeFinished: true
        });
        BlockUpdater.on("data", data => {
            this.getMyPolls({
                account: this.props.account,
                includeFinished: true
            });
        });

    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    getMyPolls = async (reqParams) => {
        const myPolls = await this.props.getMyPollsAction(reqParams);

        if (myPolls) {
            this.setState({
                ...this.props,
                myPolls: myPolls.polls
            });
        }
    };

    onPaginate = (page) => {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15
        });
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My Polls'}
                >
                    <button
                        type={'button'}
                        className="btn btn-green btn-sm"
                        style={{marginLeft: 15}}
                        onClick={() => this.props.setBodyModalParamsAction('ISSUE_POLL', {})}
                    >
                        Create Poll
                    </button>
                </SiteHeader>
                <div className="page-body container-fluid">
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
                        className={'no-min-height mb-3'}
                        emptyMessage={'No polls found.'}
                        page={this.state.page}
                        TableRowComponent={PoolItem}
                        tableData={this.state.myPolls}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyVotes);