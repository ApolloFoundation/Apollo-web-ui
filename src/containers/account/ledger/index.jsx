/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useCallback, useEffect, useRef
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getAccountLedgerAction } from '../../../actions/ledger';
import { setModalCallback } from '../../../modules/modals';
import SiteHeader from '../../components/site-header';
import {
  getAccountSelector,
  getBlockchainStatusSelector,
  getPassPhraseSelector
} from '../../../selectors';
import { TableLoader } from '../../components/TableLoader';
import { PrivateTransactionButton } from './PrivateTransationButton';
import Entry from './entry';

export default function Ledger() {
  const dispatch = useDispatch();
  const blockchainStatus = useSelector(getBlockchainStatusSelector);
  const account = useSelector(getAccountSelector);
  const passPhrase = useSelector(getPassPhraseSelector);

  const [isPrivate, setIsPrivate] = useState(null);
  const ref = useRef({
    showPrivateOnce: true,
  });

  const handlePrivateTransaction = () => setIsPrivate(true);

  const getAccountLedger = useCallback(async ({ firstIndex, lastIndex }) => {
    const params = {
      firstIndex,
      lastIndex,
      account,
      includeHoldingInfo: true,
    }

    if (isPrivate) params.secretPhrase = passPhrase;

    const accLedger = await dispatch(getAccountLedgerAction(params));
    if (accLedger) {
      if (accLedger.errorCode) {
        NotificationManager.error(accLedger.errorDescription, 'Error', 900000);
        return [];
      }
      if (accLedger.serverPublicKey && ref.current.showPrivateOnce) {
        ref.current.showPrivateOnce = false;
        NotificationManager.success('You are watching private entries.', null, 900000);
      }
      return accLedger.entries ?? [];
    }
    return [];
  }, [dispatch, isPrivate, passPhrase, account]);

  useEffect(() => {
    dispatch(setModalCallback(handlePrivateTransaction));
  }, []);

  return (
      <div className="page-content">
        <SiteHeader pageTitle="Account ledger">
          <PrivateTransactionButton isPrivate={isPrivate} />
        </SiteHeader>
        <div className="page-body container-fluid">
          <div>
            {blockchainStatus && (
            <div className="info-box info">
              <span>
                `Only ledger entries created during the last `
                {blockchainStatus.ledgerTrimKeep}
                {' '}
                blocks are displayed
              </span>
            </div>
            )}
            <TableLoader
              headersList={[
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
              className="no-min-height mb-3"
              emptyMessage="No ledger found."
              TableRowComponent={Entry}
              dataLoaderCallback={getAccountLedger}
            />
          </div>
        </div>
      </div>
  );
}
