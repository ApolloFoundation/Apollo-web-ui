/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {NotificationManager} from "react-notifications";
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header';
import {BlockUpdater} from "../../block-subscriber";
import {getpollAction, getPollResultAction, getPollVotesAction} from '../../../actions/polls';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getBlockAction} from "../../../actions/blocks";
import colorGenerator from "../../../helpers/colorGenerator";
import {getFollowedPolls} from '../../../modules/polls';
import SidebarList from '../../components/sidebar-list/';
import SidebarContentPage from '../../components/sidebar-content-page';
import CustomTable from '../../components/tables/table';
import VoteResult from './vote-result';
import PollDescription from './poll-description';
import {getAssetAction} from "../../../actions/assets";
import {getCurrencyAction} from "../../../actions/currencies";
import ContentLoader from "../../components/content-loader";
import { getFollowedPollsSelector } from '../../../selectors';
import SidebarItem from './sidebar-item';
import PollRequest from  './poll-request';
import '../messenger/Messenger.scss';
import './FollowedPools.css';

const mapStateToProps = state => ({
    followedPolls: getFollowedPollsSelector(state),
});

const mapDispatchToProps = {
    getFollowedPolls,
    getpollAction,
    getPollVotesAction,
    getPollResultAction,
    getBlockAction,
    setBodyModalParamsAction,
    getAssetAction,
    getCurrencyAction,
};

class FollowedVotes extends React.Component {
    state =  {
        page: 1,
        pollResults: null,
        poll: null,
        votes: null,
        firstIndex: 0,
        lastIndex: 3,
        allVotesNumber: null,
        colors: [],
        followedpolls: [],
        currency: null,
        asset: null,
        isPending: false,
    };

    listener = data => {
        Promise.all([
            this.getpoll({
                poll: this.props.match.params.poll
            }),
            this.getPollVotes({
                poll: this.props.match.params.poll,
                firstIndex: this.state.firstIndex,
                lastIndex:  this.state.lastIndex
            }),
            this.getpollResults({
                poll: this.props.match.params.poll
            }),
            this.props.getFollowedPolls()
        ]).then((values) => {
            this.setState({isPending: false});
        });
    };

    componentDidMount() {
        this.getpoll({
            poll: this.props.match.params.poll
        });
        this.getPollVotes({
            poll: this.props.match.params.poll,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        });
        this.getpollResults({
            poll: this.props.match.params.poll
        });
        this.props.getFollowedPolls();
        BlockUpdater.on("data", this.listener)
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    getpoll = async (reqParams) => {
        const poll = await this.props.getpollAction(reqParams);

        if (poll && !poll.errorCode) {
            this.setState({
                poll: poll
            });
        }
        return true;
    };

    getPollVotes = async (reqParams, pagination) => {
        const votes = await this.props.getPollVotesAction(reqParams);
        const allVotesNumber = await this.props.getPollVotesAction({
            ...reqParams,
            firstIndex: null,
            lastIndex: null
        });

        if (votes && allVotesNumber && allVotesNumber.votes) {
            this.setState({
                ...pagination,
                votes: votes.votes,
                allVotesNumber: allVotesNumber.votes.length
            });
        }
        return true;
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({
                isPending: true,
                colors: [],
                pollResults: null,
                poll: null,
                votes: null,
                allVotesNumber: null,
            }, () => {
                this.listener();
            });
        }
    };

    getpollResults = async (reqParams) => {
        if (reqParams.poll) {
            const pollResults = await this.props.getPollResultAction(reqParams);

            let colors = [];
            if ((!this.state.colors || this.state.colors.length === 0) && pollResults.options) {
                pollResults.options.map((el, index) => {
                    colors.push(colorGenerator());
                });
            } else {
                colors = this.state.colors;
            }

            if (pollResults) {
                this.setState({
                    pollResults: pollResults,
                    colors
                });
            }
        }
        return true;
    };

    addToFollowedPolls = () => {
        let polls = localStorage.getItem('followedPolls');

        if (polls) {
            polls = JSON.parse(polls);

            if (polls.indexOf(this.props.match.params.poll) === -1) {
                polls.push(this.props.match.params.poll);
                localStorage.setItem('followedPolls', JSON.stringify(polls));
                NotificationManager.success('Added to followed polls!', null, 5000)

            } else {
                NotificationManager.error('Already in followed polls.', 'Error', 5000)

            }
            this.props.getFollowedPolls();
        } else {
            localStorage.setItem('followedPolls', JSON.stringify([this.props.match.params.poll]))
            this.props.getFollowedPolls();
        }
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 3 - 3,
            lastIndex:  page * 3
        };
        this.getPollVotes({
            poll: this.props.match.params.poll,
            firstIndex: page * 3 - 3,
            lastIndex:  page * 3
        }, pagination);
    };

    initSidebarContent = () => (
        <SidebarList
            baseUrl={'/followed-polls/'}
            element={'poll'}
            data={this.props.followedPolls}
            bottomBarPreText={'Current Supply:&nbsp;'}
            emptyMessage={'No followed polls.'}
            Component={SidebarItem}
            isLoading={this.state.isPending}
        />
    );

    initPageContent = () => (
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
    );

    render() {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowedVotes);

