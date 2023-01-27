import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getSpecificAccountAssetsAction } from '../../../../../../actions/assets';
import { TableLoader } from '../../../../../components/TableLoader';
import { getModalDataSelector } from '../../../../../../selectors';
import Asset from './asset';

const headersList = [
  {
    name: 'Asset',
    alignRight: false
  }, {
      name: 'Quantity',
      alignRight: false
  }, {
      name: 'Total Available',
      alignRight: false
  }, {
      name: 'Percentage',
      alignRight: false
  }, {
      name: 'Lowest Ask',
      alignRight: false
  }, {
      name: 'Highest Bid',
      alignRight: false
  }, {
      name: 'Value in Coin',
      alignRight: false
  }
];

export const AssetsTable = () => {
  const dispatch = useDispatch();
  const modalData = useSelector(getModalDataSelector, shallowEqual);

  const handleLoadData = useCallback(async ({ firstIndex, lastIndex }) => {
    const res = await dispatch(getSpecificAccountAssetsAction({
      firstIndex,
      lastIndex,
      account: modalData,
    }));

    if (!res || !res.assets) return [];

    const resultAsset = res.accountAssets.map((el, index) => ({...(res.assets[index]), ...el}));
    return resultAsset;
  }, [modalData, dispatch])

  return (
    <TableLoader
      headersList={headersList}
      className='no-min-height transparent'
      emptyMessage="This account doesn\'t have any trades."
      TableRowComponent={Asset}
      dataLoaderCallback={handleLoadData}
    />
  );
}