/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { BlockUpdater } from '../../../block-subscriber/index';
import { getMyPollsAction } from '../../../../actions/polls';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table1';
import PoolItem from '../active-polls/pool-item';

export default function MyPolls() {
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [myPolls, setMyPolls] = useState(null);
  const [currentPaggination, setCurrentPaggination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 9,
  });

  const getMyPolls = useCallback(async params => {
    const reqParams = params || currentPaggination;
    const currMyPolls = await dispatch(getMyPollsAction({
      ...reqParams,
      account,
      includeFinished: true,
    }));

    if (currMyPolls) {
      setMyPolls(currMyPolls.polls);
      setCurrentPaggination(reqParams);
    }
  }, [account, currentPaggination, dispatch]);

  const onPaginate = useCallback(page => {
    getMyPolls({
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    });
  }, [getMyPolls]);

  const listener = useCallback(() => {
    getMyPolls();
  }, [getMyPolls, currentPaggination]);

  useEffect(() => {
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeAllListeners('data');
  }, [listener]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="My Polls">
        <button
          type="button"
          className="btn btn-green btn-sm"
          style={{ marginLeft: 15 }}
          onClick={() => dispatch(setBodyModalParamsAction('ISSUE_POLL', {}))}
        >
          Create Poll
        </button>
      </SiteHeader>
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
          emptyMessage="No polls found."
          page={currentPaggination.page}
          TableRowComponent={PoolItem}
          tableData={myPolls}
          isPaginate
          previousHendler={() => onPaginate(currentPaggination.page - 1)}
          nextHendler={() => onPaginate(currentPaggination.page + 1)}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
