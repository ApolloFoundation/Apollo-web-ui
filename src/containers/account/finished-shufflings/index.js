import React from 'react';
import {connect} from 'react-redux';
import uuid from "uuid";
import classNames from "classnames";
import SiteHeader from "../../components/site-header";
import ShufflingItem from './../active-shufflings/shuffling-item';
import {getFinishedShfflings} from '../../../actions/shuffling';
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";

const mapStateToPropms = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getFinishedShfflings: (reqParams) => dispatch(getFinishedShfflings(reqParams)),
    getTransactionAction: (type, data) => dispatch(getTransactionAction(type, data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

class FinishedShufflings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            finishedShufflings: null
        }
    }

    componentDidMount() {
        this.getFinishedShfflings({
            firstIndex: 0,
            lastIndex: 14
        })
        BlockUpdater.on("data", data => {
            this.getFinishedShfflings({
                firstIndex: 0,
                lastIndex: 14
            })
        });
    }

    getFinishedShfflings   = async (reqParams) => {
        const finishedShufflings =  await this.props.getFinishedShfflings(reqParams);

        if (finishedShufflings) {
            this.setState({
                ...this.state,
                finishedShufflings: finishedShufflings.shufflings
            })
        }
    };

    onPaginate = (page) => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getFinishedShfflings({
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
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
                    pageTitle={'Finished Shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="transaction-table">
                        <div className="transaction-table-body">
                            <table>
                                <thead>
                                <tr>
                                    <td>Shuffling</td>
                                    <td>Stage</td>
                                    <td>Holding</td>
                                    <td className="align-right">Amount</td>
                                    <td className="align-right">Participants</td>
                                    <td className="align-right">Issuer</td>
                                </tr>
                                </thead>
                                <tbody key={uuid()}>
                                {
                                    this.state.finishedShufflings &&
                                    this.state.finishedShufflings.map((el, index) => {
                                        return (
                                            <ShufflingItem
                                                {...el}
                                                getTransaction={this.getTransaction}
                                            />
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                            {
                                this.state.finishedShufflings &&
                                <div className="btn-box">
                                    <a
                                        className={classNames({
                                            'btn' : true,
                                            'btn-left' : true,
                                            'disabled' : this.state.page <= 1
                                        })}
                                        onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                    > Previous</a>
                                    <div className='pagination-nav'>
                                        <span>{this.state.firstIndex + 1}</span>
                                        <span>&hellip;</span>
                                        <span>{this.state.lastIndex + 1}</span>
                                    </div>
                                    <a
                                        onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                        className={classNames({
                                            'btn' : true,
                                            'btn-right' : true,
                                            'disabled' : this.state.finishedShufflings.length < 15
                                        })}
                                    >Next</a>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToPropms, mapDispatchToProps)(FinishedShufflings);