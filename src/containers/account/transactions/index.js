import React from 'react';
import { connect } from 'react-redux';
import SiteHeader from  '../../components/site-header'
import Transaction from './transaction'
import { getTransactionsAction } from "../../../actions/transactions";

class Transactions extends React.Component {
    constructor(props) {
        super(props);

        this.getTransactions = this.getTransactions.bind(this);

        this.state = {
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
            this.getTransactions({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    }

    async getTransactions (requestParams){
        const transactions = await this.props.getTransactionsAction(requestParams);
        if (transactions) {
            console.log(transactions.transactions);
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
                                    <thead>
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
                                    <tbody>
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
                                    <a className="btn btn-left"> Previous</a>
                                    <a className="btn btn-right">Next</a>
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
    account: state.account.account
})

const initMapDispatchToProps = dispatch => ({
    getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams))
})

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Transactions);