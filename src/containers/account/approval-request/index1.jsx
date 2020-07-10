/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getApprovesAction } from '../../../actions/approval-requests';
import { BlockUpdater } from '../../block-subscriber';
import TransactionComponent from './transaction/index';
import CustomTable from '../../components/tables/table';
import SiteHeader from '../../components/site-header';

export default function ApprovalRequest() {
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [transactions, setTransactions] = useState([]);

  //  ? need to check
  // const listener = data => {
  //   this.getApproves(this.props.account);
  // };

  const getApproves = useCallback(async () => {
    const approves = await dispatch(getApprovesAction(account) || {});
    setTransactions(approves.transactions || []);
  }, [account, dispatch]);

  useEffect(() => {
    getApproves();
    BlockUpdater.on('data', getApproves);

    return () => BlockUpdater.removeListener('data', getApproves);
  }, []);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Approval requests (account)"
      />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
            {
              name: 'Date',
              alignRight: false,
            }, {
              name: 'Type',
              alignRight: true,
            }, {
              name: 'Amount',
              alignRight: true,
            }, {
              name: 'Fee',
              alignRight: false,
            }, {
              name: 'Account',
              alignRight: true,
            }, {
              name: 'Judges',
              alignRight: false,
            }, {
              name: 'Height',
              alignRight: false,
            }, {
              name: 'Confirmations',
              alignRight: false,
            }, {
              name: 'Actions',
              alignRight: false,
            },
          ]}
          className="mb-3"
          // ! need to resolve problem with paginations
          // page={page}state
          emptyMessage="No approval requests found."
          TableRowComponent={TransactionComponent}
          tableData={transactions}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
