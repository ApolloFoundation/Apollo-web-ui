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
import {Link} from 'react-router-dom';
import InfoBox from '../../components/info-box';
import {BlockUpdater} from "../../block-subscriber/index";

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getMyPollsAction: (reqParams) => dispatch(getMyPollsAction(reqParams)),
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
            myPolls: null
        };

        this.getMyPolls = this.getMyPolls.bind(this);
        this.getTransaction = this.getTransaction.bind(this);
        // this.getVote  = this.getVote.bind(this);
    }

    componentDidMount() {
        this.getMyPolls({
            account: this.props.account,
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getMyPolls({
                account: this.props.account,
            });
        });

    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps(newState) {
        this.getMyPolls({
            account: newState.account,
        });
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
                    pageTitle={'My Polls'}
                />
                <div className="page-body container-fluid">
                    <div className="active-polls white-space">

                        {
                            this.state.myPolls &&
                            !!this.state.myPolls.length &&

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
                                                this.state.myPolls &&
                                                this.state.myPolls.map((el, index) => {
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
                            </div>
                        }
                        {
                            !this.state.myPolls &&
                            <div className={'loader-box'}>
                                <div className="ball-pulse">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        }
                        {
                            this.state.myPolls &&
                            !(!!this.state.myPolls.length) &&
                            <InfoBox default>
                                No active polls yet.
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