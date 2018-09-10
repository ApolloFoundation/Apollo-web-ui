import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getMyPollsAction, getVoteAction} from '../../../actions/polls';
import PoolItem from '../active-polls/pool-item';
import uuid from "uuid";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {Link} from 'react-router-dom';

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
        // this.getVote  = this.getVote.bind(this);
    }

    componentDidMount() {
        this.getMyPolls({
            account: this.props.account,
        });
    }

    componentWillReceiveProps(newState) {
        this.getMyPolls({
            account: this.props.account,
        });
    }

    async getMyPolls(reqParams){

        const myPolls = await this.props.getMyPollsAction(reqParams);

        if (myPolls) {
            this.setState({
                ...this.props,
                myPolls: myPolls.polls
            });
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    }



    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My Polls'}
                />
                <div className="page-body container-fluid">
                    <div className="active-polls white-space">
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