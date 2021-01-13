/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAssets } from '../../../modules/assets';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table1';
import AssetItem from './asset-item';

export default function Assets() {
  const dispatch = useDispatch();

  const { assets, assetsPage } = useSelector(state => state.assets);

  useEffect(() => {
    dispatch(getAssets());
  }, []);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="All assets"
      />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
            {
              name: 'Asset',
              alignRight: false,
            }, {
              name: 'Issuer',
              alignRight: false,
            }, {
              name: 'Number of accounts',
              alignRight: true,
            }, {
              name: 'Number of transfers',
              alignRight: true,
            }, {
              name: 'Number of trades',
              alignRight: true,
            }, {
              name: 'Initial supply',
              alignRight: true,
            }, {
              name: 'Total supply',
              alignRight: true,
            },
          ]}
          TableRowComponent={AssetItem}
          tableData={assets}
          isPaginate
          page={assetsPage}
          previousHendler={() => dispatch(getAssets(assetsPage - 1))}
          nextHendler={() => dispatch(getAssets(assetsPage + 1))}
          className="no-min-height mb-3"
          emptyMessage="No assets found."
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
