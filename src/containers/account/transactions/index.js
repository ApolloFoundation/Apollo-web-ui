import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import uuid from 'uuid';
import SiteHeader from  '../../components/site-header'
import Transaction from './transaction'
import { getTransactionsAction } from "../../../actions/transactions";

class Transactions extends React.Component {
    constructor(props) {
        super(props);

        this.getTransactions = this.getTransactions.bind(this);
        this.onPaginate      = this.onPaginate.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            transactions: []
        };
    }

    componentDidMount() {
        this.getTransactions({
            account: this.props.account,
            firstIndex: this.props.firstIndex,
            lastIndex: this.props.lastIndex
        })
    }

    componentWillReceiveProps(newState) {
        console.log(newState);
        this.setState({
            ...newState
        }, () => {
            let reqParams = {
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            };

            if (this.props.passphrase) {
                reqParams.passPhrase = this.props.passphrase
            }

            this.getTransactions(reqParams)
        });
    }

    onPaginate (page) {
        let reqParams = {
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };

        if (this.props.passphrase) {
            reqParams.secretPhrase = this.props.passphrase
        }

        console.log(reqParams);

        this.setState(reqParams
            , () => {
            this.getTransactions(reqParams)
        });
    }

    async getTransactions (requestParams){
        const transactions = await this.props.getTransactionsAction(requestParams);
        if (transactions) {
            this.setState({
                ...this.props,
                transactions: transactions.transactions
            });
        }
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Transactions'}
                    showPrivateTransactions={'transactions'}
                />
                <div className="page-body container-fluid">
                    <div className="my-transactions">
                        <div className="transactions-filters">
                            <div className="top-bar">
                                <div className="btn filter">All</div>
                            </div>
                            <div className="bottom-bar">
                                <div className="btn filter">All types</div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead key={uuid()}>
                                    <tr>
                                        <td>Date</td>
                                        <td>Type</td>
                                        <td className="align-right">Amount</td>
                                        <td className="align-right">Fee</td>
                                        <td>Account</td>
                                        <td className="align-right">Phasing</td>
                                        <td className="align-right">Height</td>
                                        <td className="align-right">Confirmations</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                        {
                                            this.state.transactions &&
                                            this.state.transactions.map((el, index) => {

                                                return (
                                                    <Transaction
                                                        transaction = {el}
                                                    />
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
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
                                           'disabled' : this.state.transactions.length < 15
                                       })}
                                    >Next</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    passphrase: state.modals.modalData.passphrase
});

const initMapDispatchToProps = dispatch => ({
    getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams))
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Transactions);