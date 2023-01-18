import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {NotificationManager} from "react-notifications";
import { getBlocksAction, getBlockAction } from "../../../../actions/blocks";
import TopPageBlocks from '../../../components/tob-page-blocks';
import { getAccountSelector, getBlockTimeSelector, getDecimalsSelector } from '../../../../selectors';
import { TableLoader } from '../../../components/TableLoader';
import Block from '../block';
import { headersList } from './headersList';

export const AllBlocks = ({ height }) => {
  const dispatch = useDispatch();
  const account = useSelector(getAccountSelector);
  const decimals = useSelector(getDecimalsSelector);
  const blockTime = useSelector(getBlockTimeSelector);
  const [state, setState] = useState({
    avgFee: 0,
    avgAmount: 0,
    blockGenerateTime: 0,
    transactionPerHour: 0
  });

  const getAllBlocksRequest = useCallback(async ({ firstIndex, lastIndex }) => {
      const res = await dispatch(getBlocksAction({ firstIndex, lastIndex, account}));

      if (!res || res.errorCode) return [];

      const time = Math.round((res.blocks[0].timestamp - res.blocks[res.blocks.length - 1].timestamp) / 15);

      let { totalFee, totalAmount, transactions } = res.blocks.reduce((acc, block) => ({
        totalFee: acc.totalFee + parseFloat(block.totalFeeATM),
        totalAmount: acc.totalAmount + parseFloat(block.totalAmountATM),
        transactions: acc.transactions + parseFloat(block.numberOfTransactions),
      }), {
        totalFee: 0,
        totalAmount: 0,
        transactions: 0,
      })

      transactions = time === 0 ? 0 : Math.round((transactions / (time / 60) * 60));  

      const avgFee = res.blocks ? (totalFee / decimals / res.blocks.length).toFixed(2) : 0;
      const avgAmount = res.blocks ? (totalAmount / decimals / res.blocks.length).toFixed(2) : 0;

      setState({
        avgFee,
        avgAmount,
        blockGenerateTime: time,
        transactionPerHour: Math.floor(transactions / 15)
      });

      // for getting height from input and show it at the table
      if (height) {
          const blockData = await dispatch(getBlockAction({ height }));
          if (blockData) return [blockData];
          NotificationManager.error('Incorrect height', 'Error', 5000)
      }

      return res.blocks;
  }, [dispatch, height, account]);
  
  return (
    <>
      <TopPageBlocks
        cards={[
            {
                label: 'AVG. Amount Per Block',
                value: state.avgAmount,
            }, {
                label: 'AVG. Fee Per Block',
                value: state.avgFee,
            }, {
                label: 'Transactions Per Hour',
                value: state.transactionPerHour,
            }, {
                label: 'Transactions Per Hour',
                value: [
                    {
                        label: 'Transaction Time',
                        value: blockTime,
                    },
                    {
                        label: 'Avg. Block Creating Frequency',
                        value: `${state.blockGenerateTime} s`,
                    }
                ]
            }
        ]}
      />
      <TableLoader
        headersList={headersList}
        TableRowComponent={Block}
        className='no-min-height'
        emptyMessage='No blocks found.'
        dataLoaderCallback={getAllBlocksRequest}
      />
    </>
  );
}
