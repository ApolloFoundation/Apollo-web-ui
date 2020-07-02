/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useCallback, useEffect, Suspense,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { NotificationManager } from 'react-notifications';
import { getAccountLedgerAction } from '../../../actions/ledger';
import { setModalCallback, setModalType } from '../../../modules/modals';
import { BlockUpdater } from '../../block-subscriber';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import Button from '../../components/button';
import Entry from './entry/index1';

export default function Ledger() {
  const dispatch = useDispatch();

  const { account, blockchainStatus } = useSelector(state => state.account);

  const [page, setPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(15);
  const [ledger, setLedger] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isPrivate, setIsPrivate] = useState(null);
  const [passphrase, setPassphrase] = useState(null);

  const getAccountLedger = useCallback(async requestParams => {
    const accLedger = await dispatch(getAccountLedgerAction(requestParams));
    if (accLedger) {
      if (accLedger.errorCode) {
        if (!isError) {
          NotificationManager.error(accLedger.errorDescription, 'Error', 900000);
        }
        setIsError(true);
      } else {
        if (!isPrivate && !!accLedger.serverPublicKey) {
          setIsPrivate(isPrivate);
          NotificationManager.success('You are watching private entries.', null, 900000);
        }
        setLedger(accLedger.entries);
        setIsError(false);
      }
    }
  }, [dispatch, isError, isPrivate]);

  const listener = useCallback(() => {
    getAccountLedger({
      account,
      firstIndex,
      lastIndex,
      ...passphrase,
      includeHoldingInfo: true,
    });
  }, [account, firstIndex, getAccountLedger, lastIndex, passphrase]);

  const getPrivateEntries = useCallback(data => {
    const reqParams = {
      account,
      firstIndex,
      lastIndex,
      includeHoldingInfo: true,
      ...data,
    };

    if (data) setPassphrase(data);
    getAccountLedger(reqParams);
  }, [account, firstIndex, getAccountLedger, lastIndex]);

  const onPaginate = useCallback(currPage => {
    const reqParams = {
      currPage,
      account,
      firstIndex: currPage * 15 - 15,
      lastIndex: currPage * 15,
      includeHoldingInfo: true,
      ...passphrase,
    };

    setPage(currPage);
    setFirstIndex(reqParams.firstIndex);
    setLastIndex(reqParams.lastIndex);
    getAccountLedger(reqParams);
  }, [account, getAccountLedger, passphrase]);

  useEffect(() => {
    getAccountLedger({
      account,
      firstIndex,
      lastIndex,
      includeHoldingInfo: true,
    });
    dispatch(setModalCallback(getPrivateEntries));
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, [account, dispatch, firstIndex, getAccountLedger, getPrivateEntries, lastIndex, listener]);

  return (
    <Suspense fallback="loading">
      <div className="page-content">
        <SiteHeader pageTitle="Account ledger">
          <Button
            size="sm"
            color="green"
            disabled={isPrivate}
            onClick={() => dispatch(setModalType('PrivateTransactions'))}
            name="Show private transactions"
          />
        </SiteHeader>
        <div className="page-body container-fluid">
          <div>
            {blockchainStatus && (
            <div className="info-box info">
              <span>
                Only ledger entries created during the last
                {blockchainStatus.ledgerTrimKeep}
                {' '}
                blocks are displayed
              </span>
            </div>
            )}
            <CustomTable
              header={[
                {
                  name: 'Date',
                  alignRight: false,
                }, {
                  name: 'Type',
                  alignRight: false,
                }, {
                  name: 'Change',
                  alignRight: true,
                }, {
                  name: 'Balance',
                  alignRight: true,
                }, {
                  name: 'Holding',
                  alignRight: true,
                }, {
                  name: 'Change',
                  alignRight: true,
                }, {
                  name: 'Balance',
                  alignRight: true,
                },
              ]}
              keyField="ledgerId"
              className="no-min-height mb-3"
              emptyMessage="No ledger found."
              TableRowComponent={Entry}
              tableData={ledger}
              isPaginate
              page={page}
              previousHendler={() => onPaginate(page - 1)}
              nextHendler={() => onPaginate(page + 1)}
              itemsPerPage={15}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
