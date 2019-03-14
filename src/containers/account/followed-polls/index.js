/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import {BlockUpdater} from "../../block-subscriber";
import {connect} from 'react-redux';
import '../messenger/Messenger.scss'
import './FollowedPools.css'
import classNames from "classnames";
import {getpollAction, getPollResultAction, getPollVotesAction} from '../../../actions/polls';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../actions/blocks";
import colorGenerator from "../../../helpers/colorGenerator";
import {getFollowedPolls} from '../../../modules/polls';

import uuid from "uuid";

import SidebarContent from '../../components/sidebar-list/';

import SidebarContentPage from '../../components/sidebar-content-page';
import SidebarItem from './sidebar-item';
import PollRequest from  './poll-request';
import CustomTable from '../../components/tables/table';
import VoteResult from './vote-result';
import PollDescription from './poll-description';

const mapStateToProps = state => ({
    followedPolls: state.polls.followedPolls
});

const mapDispatchToProps = dispatch => ({
    getFollowedPolls: () => dispatch(getFollowedPolls()),

    getpollAction: (reqParams) => dispatch(getpollAction(reqParams)),
    getPollVotesAction: (reqParams) => dispatch(getPollVotesAction(reqParams)),
    getPollResultAction: (reqParams) => dispatch(getPollResultAction(reqParams)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class FollowedVotes extends React.Component {
    constructor(props) {
        super(props);

        this.state =  {
            page: 1,
            pollResults: null,
            poll: null,
            votes: null,
            firstIndex: 0,
            lastIndex: 2,
            allVotesNumber: null,
            colors: [],
            followedpolls: []
        };

        this.getpoll        = this.getpoll.bind(this);
        this.getPollVotes   = this.getPollVotes.bind(this);
        this.getpollResults = this.getpollResults.bind(this);
    }

    listener = data => {
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

    async getpoll(reqParams) {
        const poll = await this.props.getpollAction(reqParams);

        if (poll && !poll.errorCode) {
            this.setState({
                ...this.state,
                poll: poll
            });
        }
    }

    async getPollVotes(reqParams) {
        const votes = await this.props.getPollVotesAction(reqParams);
        const allVotesNumber = await this.props.getPollVotesAction({
            ...reqParams,
            firstIndex: null,
            lastIndex: null
        });

        if (votes && allVotesNumber && allVotesNumber.votes) {
            this.setState({
                ...this.state,
                votes: votes.votes,
                allVotesNumber: allVotesNumber.votes.length
            });
        }
    }
    
    componentDidUpdate = (prevProps) => {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.listener()
        }
    }

    async getpollResults(reqParams) {
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
    }

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

    onPaginate (page) {
        this.setState({
            ...this.state,
            page: page,
            firstIndex: page * 3 - 3,
            lastIndex:  page * 3 - 1
        }, () => {
            this.getPollVotes({
                poll: this.props.match.params.poll,
                firstIndex: page * 3 - 3,
                lastIndex:  page * 3 - 1
            })
        });
    }

    render() {
        const {colors, allVotesNumber, poll} = this.state;
        const {followedPolls} = this.props;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Followed polls'}
                >
                    {/*<a*/}
                        {/*className="btn primary"*/}
                        {/*style={{marginLeft: 15}}*/}
                    {/*>*/}
                        {/*Add Poll*/}
                    {/*</a>*/}
                    {
                        this.props.match.params.poll &&
                        <a
                            className="btn primary"
                            style={{marginLeft: 15}}
                            onClick={() => this.addToFollowedPolls()}
                        >
                            Bookmark This Poll
                        </a>
                    }
                </SiteHeader>

                <SidebarContentPage
                    SidebarContent={() => (
                        <SidebarContent
                            baseUrl={'/followed-polls/'}
                            element={'poll'}
                            data={followedPolls}
                            bottomBarPreText={'Current Supply:&nbsp;'}
                            emptyMessage={'No followed polls.'}
                            Component={SidebarItem}
                        />
                    )}
                    PageContent={() => (
                        <>
                            {
                                this.state.poll &&
                                <>
                                    <PollDescription 
                                        poll={this.state.poll}
                                        colors={colors}
                                        pollResults={this.state.pollResults}
                                    />
                                    <div className="card card-flexible mb-3">
                                        <div className="form-group-app offset-bottom height-auto no-padding transparent">
                                            <CustomTable 
                                                header={[
                                                    {
                                                        name: 'Label',
                                                        alignRight: false
                                                    },{
                                                        name: 'Voter',
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
                                                tableData={this.state.pollResults && this.state.pollResults.results ? this.state.pollResults.results.map((el, index) => ({...el, ...colors[index], option: this.state.pollResults.options[index]})) : null}
                                                tableName={'Poll Requests'}
                                                className={'no-min-height'}
                                                emptyMessage={'No poll request.'}
                                            />
                                            <CustomTable 
                                                header={[
                                                    {
                                                        name: 'Voter',
                                                        alignRight: false
                                                    },
                                                    ...poll.options.map(el => {
                                                        console.log(el)
                                                        return {
                                                            name: el,
                                                            alignRight: true
                                                        }
                                                    })
                                                ]}
                                                tableName={`Votes cast (${allVotesNumber})`}
                                                className={'no-min-height position-static'}
                                                page={this.state.page}
                                                TableRowComponent={VoteResult}
                                                tableData={this.state.votes}
                                                isPaginate
                                                previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                                                nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                                                emptyMessage={'No poll request.'}
                                            />      
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    )}
                    pageContentClassName={'pl-3 pr-0'}
                />
                
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowedVotes);

