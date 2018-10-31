import React from 'react';
import {getPhasingTransactionVoters} from "../../../../actions/transactions";

class PhasedTransactionsHints extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        phased: null,
        lastTransaction: null
    }

    componentDidUpdate = () => {
        this.getPostionOfphasedTransactions();
    }

    getPostionOfphasedTransactions = () => {

        if (this.props.transactions && this.props.transactions[0] && this.props.transactions[0].transaction !== this.state.lastTransaction) {
            const phased = this.props.transactions.filter((el, index) => {
                return el.phased
            });

            this.setState({
                lastTransaction: this.props.transactions[0].transaction
            })

            if (phased.length) {
                const phasingTransactionInfo = phased.map((el, index) => {
                    return this.getPhasingTransactionInfo(el.transaction);
                });

                Promise.all(phasingTransactionInfo)
                    .then((data) => {
                        this.setState({
                            phased,
                            phasingTransactionInfo: data.map( el => {
                                return el.polls[0]
                            }),
                        })
                    });
            }
        }
    }

    getPhasingTransactionInfo = async (transaction) => {
        return await getPhasingTransactionVoters({transaction: transaction});
    }

    render () {
        return (
            <div className='phased-transactions'>
                {
                    this.state.phased &&
                    !!this.state.phased.length &&
                    this.state.phased.map((el, index) => {
                        const transactionId = `transaction-${el.transaction}`;
                        const sidebar = document.getElementById('sidebar-menu').getBoundingClientRect();
                        let position = document.getElementById(transactionId);

                        if (position) {
                            position = position.getBoundingClientRect()
                            return (
                                <div
                                    className="phased-transaction"
                                    data-transaction={transactionId}
                                    style={{
                                        top: position.top + window.pageYOffset,
                                        left: position.left - sidebar.width - 315
                                    }}
                                >
                                    <div className="phasing-box__phasing-description">
                                        <table>
                                            <tbody>
                                            {
                                                this.state.phasingTransactionInfo[index] &&
                                                <React.Fragment>
                                                    <tr>
                                                        <td>Accounts: </td>
                                                        <td>{this.state.phasingTransactionInfo[index].quorum}</td>

                                                    </tr>
                                                    <tr>
                                                        <td>Votes: </td>
                                                        <td>{this.state.phasingTransactionInfo[index].result}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Percentage: </td>
                                                        <td>
                                                            {
                                                                (this.state.phasingTransactionInfo[index].result / this.state.phasingTransactionInfo[index].quorum) * 100
                                                            } %
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Finish Height</td>
                                                        <td>{this.state.phasingTransactionInfo[index].finishHeight}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Approved: </td>
                                                        <td>
                                                            {
                                                                this.state.phasingTransactionInfo[index].approved ? 'Yes' : 'No'
                                                            }
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        }
                    })
                }
            </div>
        );
    }
}

export default PhasedTransactionsHints;