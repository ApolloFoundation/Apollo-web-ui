/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useState, useEffect } from 'react';
import {NotificationManager} from "react-notifications";
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header';
import { useRouteMatch, useHistory } from 'react-router-dom';
import {BlockUpdater} from "../../block-subscriber";
import '../messenger/Messenger.scss';
import './FollowedPools.css';
import {getpollAction, getPollResultAction, getPollVotesAction} from '../../../actions/polls';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getBlockAction, startBlockPullingAction} from "../../../actions/blocks";
import colorGenerator from "../../../helpers/colorGenerator";
import {getFollowedPolls} from '../../../modules/polls';
import SidebarContent from '../../components/sidebar-list/';
import SidebarContentPage from '../../components/sidebar-content-page';
import SidebarItem from './sidebar-item';
import PollRequest from  './poll-request';
import CustomTable from '../../components/tables/table';
import VoteResult from './vote-result';
import PollDescription from './poll-description';
import {getAssetAction} from "../../../actions/assets";
import {getCurrencyAction} from "../../../actions/currencies";
import ContentLoader from "../../components/content-loader";

export default function FollowedVotes() {
  const dispatch = useDispatch();

  const match = useRouteMatch();

  const [myVotes, setMyVotes] = useState(null);
  const [dataPollResults, setDataPollResults] = useState(null);
  const [dataPoll, setDataPoll] = useState(null);
  const [dataVotes, setDataVotes] = useState(null);
  const [allVotesNumber, setAllVotesNumber] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [asset, setAsset] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const [dataColors, setDataColors] = useState([]);
  const [followedpolls, setFollowedpolls] = useState([]);
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
        NotificationManager.success('Added to followed polls!', null, 5000)
      } else {
        NotificationManager.error('Already in followed polls.', 'Error', 5000)
      }

      dispatch(getFollowedPolls());
    } else {
      localStorage.setItem('followedPolls', JSON.stringify([match.params.poll]))
      dispatch(getFollowedPolls());
    }
  }, []);

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
  }, []);

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
      setAllVotesNumber(allVotesNumber.votes.length);
    }

    return true;
  } , []);

  const getPoll = useCallback(async reqParams => {
    const poll = await dispatch(getpollAction(reqParams));

    if (poll && !poll.errorCode) {
      setDataPoll(poll);
    }

    return true;
  }, []);


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
  }, []);

  const listener = useCallback(data => {
    Promise.all([
      getPoll({
        poll: match.params.poll
      }),
      getPollVotes({
            poll: match.params.poll,
            ...currentPaggination,
            // !check if needed page
            // firstIndex: this.state.firstIndex,
            // lastIndex:  this.state.lastIndex
          }),
          getPollResults({
            poll: match.params.poll
          }),
          dispatch(getFollowedPolls()),
        ]).then(() => {
      setIsPending(false);
    });
  }, []);

  useEffect(() => {
    BlockUpdater.on("data", listener)

    return () => BlockUpdater.removeListener("data", listener)
  }, []);

  // !check props prev location
  // useEffect(() => {
  //   if (this.props.location.pathname !== prevProps.location.pathname) {
  //     this.setState({
  //       isPending: true,
  //       colors: [],
  //       pollResults: null,
  //       poll: null,
  //       votes: null,
  //       allVotesNumber: null,
  //     }, () => {
  //       this.listener();
  //     });
  //   }
  // }, []);

  const initSidebarContent = useMemo(() => (
    <SidebarContent
        baseUrl={'/followed-polls/'}
        element={'poll'}
        data={this.props.followedPolls}
        bottomBarPreText={'Current Supply:&nbsp;'}
        emptyMessage={'No followed polls.'}
        Component={SidebarItem}
    />
  ), []);

  const initPageContent = useMemo(() => (
    <>
        {!this.state.isPending ? (
            this.state.poll &&
            <>
                <PollDescription
                    poll={this.state.poll}
                    colors={this.state.colors}
                    pollResults={this.state.pollResults}
                />
                <div className="card mb-3 h-auto">
                    <div className="card-title">Poll Requests</div>
                    <div className="card-body">
                        <CustomTable
                            header={[
                                {
                                    name: 'Label',
                                    alignRight: false
                                },{
                                    name: 'Answer',
                                    alignRight: false
                                },{
                                    name: 'Result',
                                    alignRight: true
                                },{
                                    name: 'Weight Supply',
                                    alignRight: true
                                }
                            ]}
                            TableRowComponent={PollRequest}
                            tableData={this.state.pollResults && this.state.pollResults.results ? this.state.pollResults.results.map((el, index) => ({...el, ...this.state.colors[index], option: this.state.pollResults.options[index]})) : null}
                            className={'no-min-height p-0'}
                            emptyMessage={'No poll request.'}
                        />
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">Votes cast ({this.state.allVotesNumber})</div>
                    <div className="card-body">
                        <CustomTable
                            header={[
                                {
                                    name: 'Voter',
                                    alignRight: false
                                },
                                ...this.state.poll.options.map(el => {
                                    return {
                                        name: el,
                                        alignRight: true
                                    }
                                })
                            ]}
                            className={'no-min-height p-0'}
                            page={this.state.page}
                            TableRowComponent={VoteResult}
                            tableData={this.state.votes}
                            isPaginate
                            itemsPerPage={3}
                            previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                            nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                            emptyMessage={'No votes found.'}
                        />
                    </div>
                </div>
            </>
        ) : (
            <ContentLoader />
        )}
    </>
  ), []);

  return (
    <div className="page-content">
        <SiteHeader
            pageTitle={'Followed polls'}
        >
            {
                this.props.match.params.poll &&
                <button
                    type={'button'}
                    className="btn btn-green btn-sm"
                    style={{marginLeft: 15}}
                    onClick={() => this.addToFollowedPolls()}
                >
                    Bookmark This Poll
                </button>
            }
        </SiteHeader>

        <SidebarContentPage
            SidebarContent={this.initSidebarContent}
            PageContent={this.initPageContent}
            pageContentClassName={'pl-3 pr-0 followed-pools'}
        />

    </div>
  );
}
