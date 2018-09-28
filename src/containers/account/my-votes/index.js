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
import InfoBox from '../../components/info-box'
import {formatTimestamp} from "../../../helpers/util/time";

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getMyVotesAction: (reqParams) => dispatch(getMyVotesAction(reqParams)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
    getVoteAction:     (requestParams) => dispatch(getVoteAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
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
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
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

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My Votes'}
                />
                <div className="page-body container-fluid">
                    <div className="active-polls white-space">
                        {
                            this.state.myVotes &&
                            <div className="transaction-table no-min-height">
                                <div className="transaction-table-body">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Title</td>
                                            <td>Description</td>
                                            <td>Sender</td>
                                            <td>Start date</td>
                                            <td>Blocks left</td>
                                            <td className="align-right">Actions</td>
                                        </tr>
                                        </thead>
                                        <tbody  key={uuid()}>
                                        {
                                            this.state.myVotes &&
                                            this.state.myVotes.map((el, index) => {
                                                return (
                                                    <PoolItem
                                                        key={uuid()}
                                                        {...el}
                                                        activepolls
                                                        getTransaction={this.getTransaction}
                                                    />
                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div> ||
                            <div className={'loader-box'}>
                                <div className="ball-pulse">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        }
                        {
                            this.state.myVotes &&
                            !(!!this.state.myVotes.length) &&
                            <InfoBox default>
                                No votes found.
                            </InfoBox>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyVotes);