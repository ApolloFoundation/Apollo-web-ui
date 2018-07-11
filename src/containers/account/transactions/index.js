import React from 'react';
import SiteHeader from  '../../components/site-header'
import Transaction from './transaction'

class Transactions extends React.Component {
    constructor(props) {
        super(props);


        // TODO migrate to action
        this.arr = new Array(15).fill(1);
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
                                            this.arr.map((el, index) => {

                                                const transaction = {
                                                    date: '6/13/2018 11:34:03',
                                                    amount: '10 455',
                                                    account: 'APL-B3WF-N86S-QQ96-95PJP -> You',
                                                    phasing: '',
                                                    height: '152526',
                                                    confirmations: '213'
                                                };

                                                return (
                                                    <Transaction
                                                        transaction = {transaction}
                                                    />
                                                )
                                            })
                                        }

                                    </tbody>
                                </table>
                                <div className="btn-box"><a className="btn btn-left"> Previous</a><a
                                    className="btn btn-right">Next</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Transactions;