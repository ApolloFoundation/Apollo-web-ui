/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getpollsAction } from '../../../../actions/polls';
import { BlockUpdater } from '../../../block-subscriber';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table1';
import PoolItem from './pool-item';

export default function Activepolls() {
  const dispatch = useDispatch();

  const [activepolls, setActivepolls] = useState(null);
  const [currentPaggination, setCurrentPaggination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getActivePolls = useCallback(async () => {
    const currentReqParams = {
      ...currentPaggination,
      includeFinished: false,
    };

    const currentActivepolls = await dispatch(getpollsAction(currentReqParams));

    if (currentActivepolls) {
      setActivepolls(currentActivepolls.polls);
    }
  }, [currentPaggination, dispatch]);

  const listener = useCallback(() => {
    getActivePolls();
  }, [getActivePolls, currentPaggination]);

  const onPaginate = useCallback(currPage => {
    const pagination = {
      currPage,
      firstIndex: currPage * 15 - 15,
      lastIndex: currPage * 15,
    };
    getActivePolls(pagination);
    setCurrentPaggination({ ...pagination });
  }, [getActivePolls]);

  useEffect(() => {
    getActivePolls();
  }, []);

  useEffect(() => {
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, [listener]);

  const { page } = currentPaggination;

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Active polls" />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
            {
              name: 'Title',
              alignRight: false,
            }, {
              name: 'Description',
              alignRight: false,
            }, {
              name: 'Sender',
              alignRight: false,
            }, {
              name: 'Start date',
              alignRight: false,
            }, {
              name: 'Blocks left',
              alignRight: false,
            }, {
              name: 'Actions',
              alignRight: true,
            },
          ]}
          className="no-min-height mb-3"
          emptyMessage="No active polls."
          TableRowComponent={PoolItem}
          tableData={activepolls}
          isPaginate
          page={page}
          previousHendler={() => onPaginate(page - 1)}
          nextHendler={() => onPaginate(page + 1)}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
