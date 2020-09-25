/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyVotesAction, getVoteAction } from '../../../../actions/polls';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { BlockUpdater } from '../../../block-subscriber/index';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table1';
import Button from '../../../components/button';
import PoolItem from '../active-polls/pool-item';

export default function MyVotes() {
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [myVotes, setMyVotes] = useState(null);
  const [currentPaggination, setCurrentPaggination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 9,
  });

  const getVote = (async reqParams => {
    const poll = await dispatch(getVoteAction(reqParams));

    if (poll) {
      return poll;
    }
  }, []);

  const getMyVotes = useCallback(async reqParams => {
    const params = reqParams || currentPaggination;

    const currMyVotes = await dispatch(getMyVotesAction({ ...params, account }));

    if (currMyVotes && currMyVotes.transactions) {
      const polls = Promise.all(currMyVotes.transactions.map(async (el, index) => await getVote({ poll: el.attachment.poll })))
        .then(data => {
          setCurrentPaggination(reqParams);
          setMyVotes(data);
        });
    }
  }, [account, currentPaggination, dispatch, getVote]);

  const onPaginate = useCallback(page => {
    getMyVotes({
      page,
      firstIndex: page * 9 - 9,
      lastIndex: page * 9,
    });
  }, [getMyVotes]);

  const listener = useCallback(() => {
    getMyVotes();
  }, [currentPaggination, getMyVotes]);

  useEffect(() => {
    getMyVotes();
  }, []);

  useEffect(() => {
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeAllListeners('data');
  }, [listener]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="My Votes">
        <Button
          size="sm"
          onClick={() => dispatch(setBodyModalParamsAction('ISSUE_POLL', {}))}
          name="Create Poll"
        />
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
          emptyMessage="No votes found."
          className="mb-3"
          page={currentPaggination.page}
          TableRowComponent={PoolItem}
          tableData={myVotes}
          isPaginate
          previousHendler={() => onPaginate(currentPaggination.page - 1)}
          nextHendler={() => onPaginate(currentPaggination.page + 1)}
          itemsPerPage={9}
        />
      </div>
    </div>
  );
}
