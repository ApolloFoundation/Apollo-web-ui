import React from 'react';
import { ScheduledTransactionItem } from "../ScheduledTransactionItem";

export const ScheduleTransactionTable = ({ scheduledTransactions, deleteScheduledTransaction }) => {
  return (
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
                      <td className="align-right">Height</td>
                      <td className="align-right">Actions</td>
                  </tr>
              </thead>
              <tbody>
              {
                  scheduledTransactions &&
                  scheduledTransactions.length > 0 &&
                  scheduledTransactions.map((el) => 
                      <ScheduledTransactionItem
                          key={el.transaction}
                          deleteSheduledTransaction={deleteScheduledTransaction}
                          {...el}
                      />
                  )
              }
              </tbody>
          </table>
      </div>
    </div>
  );
}