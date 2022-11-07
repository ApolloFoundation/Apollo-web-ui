/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAccountBlockCountAction, getForgedBlocksAction } from "../../../../actions/blocks";
import TopPageBlocks from '../../../components/tob-page-blocks';
import { TableLoader } from '../../../components/TableLoader';
import {
  getAccountInfoSelector,
  getForgedBalanceSelector,
  getBlockTimeSelector
} from '../../../../selectors';
import Block from '../block';
import { headersList } from './headersList';

export const ForgedBlocks = () => {
  const dispatch = useDispatch();
  const { decimals, account } = useSelector(getAccountInfoSelector);
  const forgedBalance = useSelector(getForgedBalanceSelector);
  const blockTime = useSelector(getBlockTimeSelector);

  const [state, setState] = useState({
    avgFee: 0,
    avgAmount: 0,
    transactionPerHour: 0,
    forgedFees: 0,
    forgedBlocks: 0,
  })

  const getForgedBlocks = useCallback(async ({ firstIndex, lastIndex }) => {
      const response = await dispatch(getForgedBlocksAction({
        account,
        firstIndex,
        lastIndex,
        isForged: true,
        page: 1,
      }));

      if (!response || response.errorCode) {
        return [];
      }

      const blockCount = await dispatch(getAccountBlockCountAction({
        account, firstIndex, lastIndex
      }));
      let avgFee = 0;
      let forgedBlocks = 0;
      if (blockCount.numberOfBlocks && blockCount.numberOfBlocks > 0) {
          forgedBlocks = blockCount.numberOfBlocks;
          avgFee = (forgedBalance / blockCount.numberOfBlocks / decimals).toFixed(2);
      }

      let {totalAmount, transactions } = response.blocks.reduce((acc, block) => ({
        totalAmount: acc.totalAmount + parseFloat(block.totalAmountATM),
        transactions: acc.numberOfTransactions + parseFloat(block.numberOfTransactions),
      }), {
        totalFee: 0,
        totalAmount: 0,
        transactions: 0,
      })

      const avgAmount = response.blocks.length
        ? (totalAmount / decimals / response.blocks.length).toFixed(2) : 0;

      setState({
        avgFee,
        avgAmount,
        transactionPerHour: Math.floor(transactions / 15),
        forgedFees: forgedBalance / decimals,
        forgedBlocks,
      });

      return response?.blocks ?? [];
  }, [dispatch, account]);
  
  return (
    <>
      <TopPageBlocks
        cards={[
          {
            label: 'AVG. Amount Per Block',
            value: state.avgAmount
          }, {
            label: 'AVG. Fee Per Block',
            value: state.avgFee
          }, {
            label: 'Transaction Time',
            value: blockTime
          }, {
            label: '# Forged Blocks',
            value: [
              {
                label: '# Forged Blocks',
                value: state.forgedBlocks
              },
              {
                label: 'Forged Fees Total',
                value: `${state.forgedFees}`
              }
            ]
          }
        ]}
      />
      <TableLoader
        headersList={headersList}
        TableRowComponent={Block}
        className='no-min-height'
        emptyMessage='No forged blocks found.'
        dataLoaderCallback={getForgedBlocks}
      />
    </>
  );
} 