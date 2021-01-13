import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import TransactionItem from './transaction-item';
import ContentLoader from '../../../components/content-loader';

const MyTransactions = () => {
  const { dashboardTransactions } = useSelector(state => state.dashboard);

  const transactionContent = useMemo(() => {
    if (!dashboardTransactions) {
      return (
        <ContentLoader noPaddingOnTheSides />
      );
    }

    if (dashboardTransactions.length) {
      return (
        dashboardTransactions.map((el, index) => (
          <TransactionItem
            key={`transaction-item-${index}`}
            {...el}
          />
        ))
      );
    }

    return (
      <p>No Transactions.</p>
    );
  }, [dashboardTransactions]);

  return (
    <div className={`card card-light card-transactions ${dashboardTransactions && !dashboardTransactions.length ? 'empty' : ''}`}>
      <div className="card-title">
        <div className="title">My Transactions</div>
      </div>
      <div className="card-body">
        {transactionContent}
      </div>
    </div>
  );
};

export default MyTransactions;
