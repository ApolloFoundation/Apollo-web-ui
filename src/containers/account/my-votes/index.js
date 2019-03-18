/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getMyVotesAction, getVoteAction} from '../../../actions/polls';
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
    getMyVotesAction: (reqParams) => dispatch(getMyVotesAction(reqParams)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
    getVoteAction:     (requestParams) => dispatch(getVoteAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


class MyVotes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 14,
            page: 1,
            myVotes: null
        };

        this.getMyVotes   = this.getMyVotes.bind(this);
        this.getVote   = this.getVote.bind(this);
    }

    componentDidMount() {
        this.getMyVotes({
            account: this.props.account,
            firstIndex: 0,
            lastIndex:  9,
        });
        BlockUpdater.on("data", data => {
            this.getMyVotes({
                account: this.props.account,
                firstIndex: 0,
                lastIndex:  9,
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps(newState) {
        this.getMyVotes({
            account: this.props.account,
            firstIndex: 0,
            lastIndex:  9,
        });
    }

    getMyVotes = async (reqParams) => {
        const myVotes = await this.props.getMyVotesAction(reqParams);

        if (myVotes && myVotes.transactions) {

            let polls = Promise.all(myVotes.transactions.map(async (el, index) => {
                return await this.getVote({
                    poll: el.attachment.poll,
                });
            }))
                .then((data) => {
                    this.setState({
                        ...this.props,
                        myVotes: data
                    });
                })
        }
    };

    getVote = async (reqParams) => {
        const poll = await this.props.getVoteAction(reqParams);

        if (poll) {
            return poll
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
    
    onPaginate = (page) => {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        });
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My Votes'}
                >
                    <a
                        className="btn primary"
                        style={{marginLeft: 15}}
                        onClick={() => this.props.setBodyModalParamsAction('ISSUE_POLL', {})}
                    >
                        Create Poll
                    </a>
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
                        emptyMessage={'No votes found.'}
                        className={'mb-3'}
                        page={this.state.page}
                        TableRowComponent={PoolItem}
                        tableData={this.state.myVotes}
                        isPaginate
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
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