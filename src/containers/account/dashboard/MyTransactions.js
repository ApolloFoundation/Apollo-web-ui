import React from 'react';
import {connect} from 'react-redux';
import TransactionItem from "./TransactionItem";
import ContentLoader from "../../components/content-loader";

const MyTransactions = ({dashboardTransactions}) => (
    <div className={`card card-light card-transactions`}>
        <div className="card-title">
            <div className={'title'}>My Transactions</div>
        </div>
        <div className="card-body">
            {dashboardTransactions ? (
                dashboardTransactions.map((el, index) => (
                    <TransactionItem
                        key={`transaction-item-${index}`}
                        {...el}
                    />
                ))
            ) : (
                <ContentLoader noPaddingOnTheSides/>
            )}
        </div>
    </div>
);

const mapStateToProps = state => ({
    dashboardTransactions: state.dashboard.dashboardTransactions,
});

export default connect(mapStateToProps)(MyTransactions)