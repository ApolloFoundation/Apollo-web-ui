import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import Transaction from '../transaction';

class DashboardTransactions extends Component {
    render () {
        const {dashboardTransactions} = this.props;

        return (
            <div className="card card-tall transactions media-min-height">
                <div className="card-title">Transactions</div>
                <div className="transactions-dashboard scroll">
                    {
                        dashboardTransactions &&
                        dashboardTransactions.map((el, index) => {
                            return (
                                <Transaction
                                    getTransaction={this.getTransaction}
                                    {...el}
                                />
                            );
                        }) ||
                        <div
                            style={{
                                marginTop: 30
                            }}
                            className={'loader-box'}
                        >
                            <div className="ball-pulse">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    }
                    {/* {
                        !!this.state.transactions &&
                        !this.state.transactions.length &&
                        <p
                            style={{paddingTop: 27}}
                        >
                            No transactions found.
                        </p>
                    } */}
                </div>
            </div>
    
        );
    }
}

const mapStateToProps = state => ({
    dashboardTransactions : state.dashboard.dashboardTransactions,
})

export default connect(mapStateToProps)(DashboardTransactions)