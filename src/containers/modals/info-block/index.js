/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getBlockAction } from 'actions/blocks';
import CustomTable from 'containers/components/tables/table';
import TabulationBody from 'containers/components/tabulator/tabuator-body';
import TabContaier from 'containers/components/tabulator/tab-container';
import ModalBody from 'containers/components/modals/modal-body';
import ContentLoader from 'containers/components/content-loader';
import { getDecimalsSelector, getModalDataSelector } from 'selectors';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';
import Transaction from 'containers/account/transactions/transaction';
import { BlockDetails } from './BlockDetails';
import './index.scss';

const InfoBlock = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [blockInfo, setBlockInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const modalData = useSelector(getModalDataSelector, shallowEqual); 
  const decimals = useSelector(getDecimalsSelector);
  const formatTimestamp = useFormatTimestamp();

  const checkBlock = useCallback(async () => {
    const isString = typeof modalData === 'string' || typeof modalData === 'number';

    if (isString) {
      const res = await dispatch(getBlockAction({ height: modalData }));
      setBlockInfo(res);
    } else if (modalData) {
      setBlockInfo(modalData);
    }
    setIsLoading(false);
  }, [modalData, dispatch]);

  useEffect(() => {
    checkBlock();
  }, [checkBlock]);

  return (
    <ModalBody
      modalTitle={`Block ${blockInfo?.block ?? ''} (${blockInfo?.height ?? ''}) info`}
      isXWide
      isDisableFormFooter
      isDisableSecretPhrase
      closeModal={closeModal}
    >
      {isLoading && <ContentLoader />}
      {!isLoading && !blockInfo && (
        <div className="modal-form">
          <div className="form-group-app media-tab">
            <div className="info-box-error">Data load error</div>
          </div>
        </div>
      )}
      {(modalData && blockInfo && !isLoading) && (
          <TabulationBody>
            <TabContaier sectionName="Transactions">
              <CustomTable
                header={[
                  {
                    name: 'Date',
                    alignRight: false,
                  }, {
                    name: 'Type',
                    alignRight: false,
                  }, {
                    name: 'Amount',
                    alignRight: true,
                  }, {
                    name: 'Fee',
                    alignRight: true,
                  }, {
                    name: 'Account',
                    alignRight: false,
                  }, {
                    name: 'Phasing',
                    alignRight: true,
                  }, {
                    name: 'Height',
                    alignRight: true,
                  }, {
                    name: 'Confirmations',
                    alignRight: true,
                  },
                ]}
                className="no-min-height transparent pt-4"
                emptyMessage="No transactions found."
                TableRowComponent={Transaction}
                tableData={blockInfo.transactions}
              />
            </TabContaier>
            <TabContaier sectionName="Executed phased transactions">
              <p>No executed phased transactions in this block.</p>
            </TabContaier>
            <TabContaier sectionName="Block details">
                <BlockDetails
                  blockInfo={blockInfo}
                  decimals={decimals}
                  formatTimestamp={formatTimestamp}
                />
            </TabContaier>
          </TabulationBody>
        )
      }
    </ModalBody>
  );
}

export default InfoBlock;
