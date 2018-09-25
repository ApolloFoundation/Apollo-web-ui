import React from 'react';
import SiteHeader from '../../components/site-header';
import Pie from './pie-diagram';
import {BlockUpdater} from "../../block-subscriber";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import '../messenger/Messenger.scss'
import './FollowedPools.css'
import classNames from "classnames";
import {getpollAction, getPollResultAction, getPollVotesAction} from '../../../actions/polls';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../actions/blocks";
import colorGenerator from "../../../helpers/colorGenerator";
import uuid from "uuid";


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    getpollAction: (reqParams) => dispatch(getpollAction(reqParams)),
    getPollVotesAction: (reqParams) => dispatch(getPollVotesAction(reqParams)),
    getPollResultAction: (reqParams) => dispatch(getPollResultAction(reqParams)),
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
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
            colors: []
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
        this.getFollowedPolls();
        this.getBlock();
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
        this.getFollowedPolls();
        this.getBlock();
        BlockUpdater.on("data", this.listener)
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    componentWillReceiveProps(newState) {
        this.getpoll({
            poll: newState.match.params.poll
        });
        this.getPollVotes({
            poll: newState.match.params.poll,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        });
        this.getpollResults({
            poll: newState.match.params.poll
        });
        this.getFollowedPolls();
        this.getBlock();
    }

    async getpoll(reqParams) {
        const poll = await this.props.getpollAction(reqParams);

        if (poll) {
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

    getBlock = async () => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block: block
            })
        }
    };

    async getpollResults(reqParams) {
        const pollResults = await this.props.getPollResultAction(reqParams);

        let colors = [];
        if (!this.state.colors || this.state.colors.length === 0) {
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
            this.getFollowedPolls();
        } else {
            localStorage.setItem('followedPolls', JSON.stringify([this.props.match.params.poll]))
            this.getFollowedPolls();
        }
    };

    getFollowedPolls = () => {
        let polls = localStorage.getItem('followedPolls');

        if (polls) {
            polls = JSON.parse(polls);
            const followedpolls = polls.map(async (el, index) => {
                return this.props.getpollAction({poll: el});
            });

            Promise.all(followedpolls)
                .then((data) => {
                    this.setState({
                        followedpolls: data
                    })
                })
        } else {
            this.setState({
                followedpolls: []
            })
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

                {
                    this.state.poll &&
                    <div className="page-body container-fluid followed-polls-container">
                        <div className="followed-polls">
                            <div className="followed-polls-item">
                                <div className="left">
                                    <div className="card card-full-screen no-padding">
                                        {
                                            this.state.followedpolls && this.state.block &&
                                            this.state.followedpolls.map((el, index)=> {
                                                const blocksLeft = parseInt(el.finishHeight) - parseInt(this.state.block.height);
                                                if (el.name) {
                                                    return (
                                                        <Link
                                                            to={'/followed-polls/' + el.poll}
                                                            className={classNames({
                                                                'chat-item': true,
                                                                'active': el.poll === this.props.match.params.poll
                                                            })}
                                                            style={{
                                                                display: 'block'
                                                            }}
                                                        >

                                                            <div

                                                                className="chat-box-item"
                                                            >
                                                                <div className="chat-box-rs">
                                                                    {el.name}
                                                                </div>
                                                                <div className="chat-date">
                                                                    {
                                                                        blocksLeft > 0 &&
                                                                        'Blocks left:' + blocksLeft
                                                                    }
                                                                    {
                                                                        blocksLeft < 0 &&
                                                                        'Poll has been finished ' + (blocksLeft * -1) + ' blocks ago'
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>

                                                    )
                                                }
                                            })
                                        }
                                        {
                                            this.state.followedpolls && !this.state.followedpolls.length &&
                                            <p className={"no-followed-polls"}>No followed polls</p>
                                        }
                                    </div>
                                </div>
                                {
                                    this.props.match.params.poll &&
                                    <div className="right">
                                        <div className="card card-flexible">

                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="right-bar">
                                                        <div className="form-group-app">
                                                            <div className="form-title">
                                                                <p>{this.state.poll.name}</p>
                                                            </div>
                                                            <div className="account-bar">
                                                                <div className="information">
                                                                    <div className="title">Account:&nbsp;&nbsp;</div>
                                                                    <div className="content">{this.state.poll.accountRS}</div>
                                                                </div>
                                                                <div className="information">
                                                                    <div className="title">Poll ID:&nbsp;&nbsp;</div>
                                                                    <div className="content">{this.state.poll.poll}</div>
                                                                </div>
                                                            </div>
                                                            <div className="description-bar word-brake">
                                                                <p>{this.state.poll.description}</p>
                                                            </div>
                                                            {
                                                                !this.state.poll.finished &&
                                                                <a
                                                                    onClick={() => this.props.setBodyModalParamsAction('CAST_VOTE', this.state.poll.poll)}
                                                                    className="btn btn-primary static blue"
                                                                >
                                                                    Vote in poll
                                                                </a>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-md-5"
                                                    style={{
                                                        transition: 'all 0.3s ease-in-out'
                                                    }}
                                                >
                                                    {
                                                        this.state.colors.length > 0 && this.state.pollResults && this.state.poll.options && this.state.pollResults.results &&
                                                        <Pie
                                                            data={this.state.pollResults.results.map((el, index) => {
                                                                return parseInt(el.result) || 0.05
                                                            })}
                                                            votes={this.state.poll.options}
                                                            radius={ 150 }
                                                            hole={ 0 }
                                                            colors={ this.state.colors }
                                                            strokeWidth={ 1 }
                                                            stroke={ 'rgba(0, 0, 0, .5)' }
                                                        />
                                                    }

                                                </div>
                                            </div>

                                        </div>

                                        <div className="card card-flexible">
                                            {
                                                this.state.poll && this.state.pollResults &&
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="right-bar">
                                                            <div className="form-group-app height-auto">
                                                                <div className="form-title">
                                                                    <p>Poll Requests</p>
                                                                </div>
                                                                <div className="transaction-table no-min-height">
                                                                    <div className="transaction-table-body padding-only-top">
                                                                        <table>
                                                                            <thead>
                                                                            <tr>
                                                                                <td>Label</td>
                                                                                <td>Voter</td>
                                                                                <td className="align-right">Result</td>
                                                                                <td className="align-right">Weight</td>
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                            {
                                                                                this.state.colors.length > 0 &&
                                                                                this.state.pollResults.options &&
                                                                                this.state.pollResults.options.map((el, index) => {

                                                                                    return (
                                                                                        <tr key={uuid()}>
                                                                                            <td><div className="color-box" style={{background: 'linear-gradient(' + this.state.colors[index].startColorGradient + ', ' + this.state.colors[index].stopColorGradient + ')'}}/></td>
                                                                                            <td>{el}</td>
                                                                                            <td className="align-right">{this.state.pollResults.results[index].result}</td>
                                                                                            <td className="align-right">{this.state.pollResults.results[index].weight}</td>
                                                                                        </tr>
                                                                                    );
                                                                                })
                                                                            }
                                                                            </tbody>
                                                                        </table>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                this.state.votes &&
                                                                <div className="form-group-app height-auto">
                                                                    <div className="form-title">
                                                                        <p>Votes cast ({this.state.allVotesNumber})</p>
                                                                    </div>
                                                                    <div className="transaction-table no-min-height">
                                                                        <div className="transaction-table-body padding-only-top">
                                                                            <table>
                                                                                <thead>
                                                                                <tr>
                                                                                    <td>Voter</td>
                                                                                    <td className="align-right">Result</td>
                                                                                    <td className="align-right">Weight</td>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {
                                                                                    this.state.votes.map((el, index) => {
                                                                                        return (
                                                                                            <tr key={uuid()}>
                                                                                                <td className="blue-link-text">
                                                                                                    <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', el.voter)}> {el.voterRS} </a>
                                                                                                </td>
                                                                                                {
                                                                                                    el.votes.map((subEl, subIndex) => {
                                                                                                        return (
                                                                                                            <td key={uuid()} className="align-right">{subEl}</td>
                                                                                                        );
                                                                                                    })
                                                                                                }
                                                                                            </tr>
                                                                                        );
                                                                                    })
                                                                                }
                                                                                </tbody>
                                                                            </table>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                this.state.votes &&
                                                <div className="btn-box">
                                                    <a
                                                        className={classNames({
                                                            'btn' : true,
                                                            'btn-left' : true,
                                                            'disabled' : this.state.page <= 1
                                                        })}
                                                        onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                                    > Previous</a>
                                                    <div className='pagination-nav'>
                                                        <span>{this.state.firstIndex + 1}</span>
                                                        <span>&hellip;</span>
                                                        <span>{this.state.lastIndex + 1}</span>
                                                    </div>
                                                    <a
                                                        onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                                        className={classNames({
                                                            'btn' : true,
                                                            'btn-right' : true,
                                                            'disabled' : this.state.votes.length < 3
                                                        })}
                                                    >Next</a>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowedVotes);

