import React, {Component} from 'react';
import {connect} from 'react-redux';

import Transaction from '../transaction';

class DashboardTransactions extends Component {
    render() {
        const {dashboardTransactions} = this.props;

        return (
            <div className="card card-tall transactions media-min-height">
                <div className="card-title">Transactions</div>
                <div className="card-body">
                    <div className="transactions-dashboard scroll">
                        {
                            dashboardTransactions &&
                            dashboardTransactions.map((el, index) => {
                                return (
                                    <Transaction
                                        key={index}
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
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    dashboardTransactions: state.dashboard.dashboardTransactions,
})

export default connect(mapStateToProps)(DashboardTransactions)