/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useCallback, useState, useEffect,
} from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { BlockUpdater } from '../../../block-subscriber';
import {
  getpollAction, getPollResultAction, getPollVotesAction,
} from '../../../../actions/polls';
import { getFollowedPolls } from '../../../../modules/polls';
import colorGenerator from '../../../../helpers/colorGenerator';
import SiteHeader from '../../../components/site-header';
import SidebarContentPage from '../../../components/sidebar-content-page';
import SidebarContent from '../../../components/sidebar-list';
import CustomTable from '../../../components/tables/table';
import ContentLoader from '../../../components/content-loader';
import Button from '../../../components/button';
// Followed polls items
import PollDescription from './poll-description';
import VoteResult from './vote-result';
import SidebarItem from './sidebar-item';
import PollRequest from './poll-request';

import '../../messenger/Messenger.scss';
import './FollowedPools.css';

export default function FollowedVotes() {
  const dispatch = useDispatch();

  const match = useRouteMatch();

  const { followedPolls } = useSelector(state => state.polls);

  const [dataPollResults, setDataPollResults] = useState(null);
  const [dataPoll, setDataPoll] = useState(null);
  const [dataVotes, setDataVotes] = useState(null);
  const [dataAllVotesNumber, setDataAllVotesNumber] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [dataColors, setDataColors] = useState([]);
  const [currentPaggination, setCurrentPaggination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 3,
  });

  const addToFollowedPolls = useCallback(() => {
    const polls = JSON.parse(localStorage.getItem('followedPolls'));

    if (polls) {
      // !check parse
      if (polls.indexOf(match.params.poll) === -1) {
        polls.push(match.params.poll);
        localStorage.setItem('followedPolls', JSON.stringify(polls));
        NotificationManager.success('Added to followed polls!', null, 5000);
      } else {
        NotificationManager.error('Already in followed polls.', 'Error', 5000);
      }

      dispatch(getFollowedPolls());
    } else {
      localStorage.setItem('followedPolls', JSON.stringify([match.params.poll]));
      dispatch(getFollowedPolls());
    }
  }, [dispatch, match.params.poll]);

  const getPollResults = useCallback(async reqParams => {
    if (reqParams.poll) {
      const pollResults = await dispatch(getPollResultAction(reqParams));

      let colors = [];
      if ((!dataColors || dataColors.length === 0) && pollResults?.options) {
        pollResults.options.map((el, index) => {
          colors.push(colorGenerator());
        });
      } else {
        colors = dataColors;
      }

      if (pollResults) {
        setDataPollResults(pollResults);
        setDataColors(colors);
      }
    }

    return true;
  }, [dataColors, dispatch]);

  const getPollVotes = useCallback(async (reqParams, pagination) => {
    const votes = await dispatch(getPollVotesAction(reqParams));
    const allVotesNumber = await dispatch(getPollVotesAction({
      ...reqParams,
      firstIndex: null,
      lastIndex: null,
    }));

    if (votes && allVotesNumber && allVotesNumber.votes) {
      setCurrentPaggination(pagination);
      setDataVotes(votes.votes);
      setDataAllVotesNumber(allVotesNumber.votes.length);
    }

    return true;
  }, [dispatch]);

  const getPoll = useCallback(async reqParams => {
    const poll = await dispatch(getpollAction(reqParams));

    if (poll && !poll.errorCode) {
      setDataPoll(poll);
    }

    return true;
  }, [dispatch]);

  const onPaginate = useCallback(page => {
    const pagination = {
      page,
      firstIndex: page * 3 - 3,
      lastIndex: page * 3,
    };

    getPollVotes({
      poll: match.params.poll,
      ...pagination,
    }, pagination);
  }, [getPollVotes, match.params.poll]);

  const listener = useCallback(() => {
    Promise.all([
      getPoll({ poll: match.params.poll }),
      getPollVotes({
        poll: match.params.poll,
        ...currentPaggination,
        // !check if needed page
        // firstIndex: this.state.firstIndex,
        // lastIndex:  this.state.lastIndex
      }),
      getPollResults({ poll: match.params.poll }),
      dispatch(getFollowedPolls()),
    ]).then(() => {
      setIsPending(false);
    });
  }, [currentPaggination, dispatch, getPoll, getPollResults, getPollVotes, match.params.poll]);

  useEffect(() => {
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, [listener]);

  const initSidebarContent = () => (
    <SidebarContent
      baseUrl="/followed-polls/"
      element="poll"
      data={followedPolls}
      bottomBarPreText={'Current Supply:&nbsp;'}
      emptyMessage="No followed polls."
      Component={SidebarItem}
    />
  );

  const initPageContent = useCallback(() => {
    if (isPending) {
      return <ContentLoader />;
    }

    if (dataPoll) {
      return (
        <>
          <PollDescription
            poll={dataPoll}
            colors={dataColors}
            pollResults={dataPollResults}
          />
          <div className="card mb-3 h-auto">
            <div className="card-title">Poll Requests</div>
            <div className="card-body">
              <CustomTable
                header={[
                  {
                    name: 'Label',
                    alignRight: false,
                  }, {
                    name: 'Answer',
                    alignRight: false,
                  }, {
                    name: 'Result',
                    alignRight: true,
                  }, {
                    name: 'Weight Supply',
                    alignRight: true,
                  },
                ]}
                TableRowComponent={PollRequest}
                tableData={dataPollResults?.results ? dataPollResults.results.map((el, index) => ({
                  ...el, ...dataColors[index], option: dataPollResults.options[index],
                })) : null}
                className="no-min-height p-0"
                emptyMessage="No poll request."
              />
            </div>
          </div>
          <div className="card">
            <div className="card-title">
              Votes cast (
              {dataAllVotesNumber}
              )
            </div>
            <div className="card-body">
              <CustomTable
                header={[
                  {
                    name: 'Voter',
                    alignRight: false,
                  },
                  ...dataPoll.options.map(el => ({
                    name: el,
                    alignRight: true,
                  })),
                ]}
                className="no-min-height p-0"
                page={currentPaggination.page}
                TableRowComponent={VoteResult}
                tableData={dataVotes}
                isPaginate
                itemsPerPage={3}
                previousHendler={() => onPaginate(currentPaggination.page - 1)}
                nextHendler={() => onPaginate(currentPaggination.page + 1)}
                emptyMessage="No votes found."
              />
            </div>
          </div>
        </>
      );
    }

    return <></>;
  }, [
    currentPaggination.page, dataAllVotesNumber, dataColors,
    dataPollResults, dataVotes, isPending, onPaginate, dataPoll,
  ]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Followed polls">
        {match.params.poll && (
          <Button
            size="sm"
            name="Bookmark This Poll"
            onClick={addToFollowedPolls}
          />
        )}
      </SiteHeader>
      <SidebarContentPage
        SidebarContent={initSidebarContent}
        PageContent={initPageContent}
        pageContentClassName="pl-3 pr-0 followed-pools"
      />
    </div>
  );
}
