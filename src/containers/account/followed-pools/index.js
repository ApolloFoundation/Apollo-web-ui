import React from 'react';
import SiteHeader from '../../components/site-header';
import Pie from './pie-diagram';

import {connect} from 'react-redux';
import '../messenger/Messenger.scss'
import './FollowedPools.css'
import classNames from "classnames";
import {getPoolAction, getPollResultAction, getPollVotesAction} from '../../../actions/pools';
import {setBodyModalParamsAction} from "../../../modules/modals";


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    getPoolAction: (reqParams) => dispatch(getPoolAction(reqParams)),
    getPollVotesAction: (reqParams) => dispatch(getPollVotesAction(reqParams)),
    getPollResultAction: (reqParams) => dispatch(getPollResultAction(reqParams)),
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
            allVotesNumber: null
        };

        this.getPool        = this.getPool.bind(this);
        this.getPollVotes   = this.getPollVotes.bind(this);
        this.getPoolResults = this.getPoolResults.bind(this);
    }

    componentDidMount() {
        this.getPool({
            poll: this.props.match.params.poll
        });
        this.getPollVotes({
            poll: this.props.match.params.poll,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        });
        this.getPoolResults({
            poll: this.props.match.params.poll
        });

    }

    async getPool(reqParams) {
        const poll = await this.props.getPoolAction(reqParams);

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

        if (votes && allVotesNumber) {
            this.setState({
                ...this.state,
                votes: votes.votes,
                allVotesNumber: allVotesNumber.votes.length
            });
        }
    }

    async getPoolResults(reqParams) {
        const pollResults = await this.props.getPollResultAction(reqParams);

        if (pollResults) {
            this.setState({
                ...this.state,
                pollResults: pollResults
            });
        }
    }

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
        console.log(this.state);
        const colors = [
            {
                startColorGradient: '#008CDC',
                stopColorGradient : '#00C8FF'
            }, {
                startColorGradient: '#0019E1',
                stopColorGradient : '#0050FF'
            }, {
                startColorGradient: '#00788C',
                stopColorGradient : '#00A0B4'
            }, {
                startColorGradient: '#008C46',
                stopColorGradient : '#00B45A'
            }
        ];

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Followed polls'}
                />
                {
                    this.state.poll &&
                    <div className="page-body container-fluid">
                        <div className="messenger">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="left-bar">
                                        <div className="card card-full-screen no-padding">
                                            <div className="chat-item">
                                                <div className="chat-box-item">
                                                    <div className="chat-box-rs">
                                                        {this.state.poll.name}
                                                    </div>
                                                    <div className="chat-date">
                                                        Blocks left: 3,946
                                                    </div>
                                                </div>
                                                <div className="chat-box-item">
                                                    <div className="chat-box-rs">
                                                        I CAN'T VIEW ALL MY ALIAS NAMES
                                                    </div>
                                                    <div className="chat-date">
                                                        Blocks left: 1,356
                                                    </div>
                                                </div>
                                                <div className="chat-box-item">
                                                    <div className="chat-box-rs">
                                                        User Interface Upgrade
                                                    </div>
                                                    <div className="chat-date">
                                                        Blocks left: 95
                                                    </div>
                                                </div>
                                                <div className="chat-box-item">
                                                    <div className="chat-box-rs">
                                                        Should Apollo add a Live-Chatroom
                                                    </div>
                                                    <div className="chat-date">
                                                        Blocks left: 187
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card card-flexible">

                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="right-bar">
                                                    <div className="form-group">
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
                                                        <div className="description-bar">
                                                            <p>{this.state.poll.description}</p>
                                                        </div>
                                                        {
                                                            !this.state.poll.finished &&
                                                            <div className="btn btn-primary static blue">Vote in poll</div>
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
                                                    this.state.pollResults && this.state.poll.options &&
                                                    <Pie
                                                        data={this.state.pollResults.results.map((el, index) => {
                                                            return parseInt(el.result) || 0.05
                                                        })}
                                                        votes={this.state.poll.options}
                                                        radius={ 150 }
                                                        hole={ 0 }
                                                        colors={ colors }
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
                                                        <div className="form-group height-auto">
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
                                                                                this.state.pollResults.options.map((el, index) => {

                                                                                    return (
                                                                                        <tr>
                                                                                            <td><div className="color-box" style={{background: 'linear-gradient(' + colors[index].startColorGradient + ', ' + colors[index].stopColorGradient + ')'}}/></td>
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
                                                            <div className="form-group height-auto">
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
                                                                                        <tr>
                                                                                            <td className="blue-link-text">
                                                                                                <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', el.voter)}> {el.voterRS} </a>
                                                                                            </td>
                                                                                            {
                                                                                                el.votes.map((subEl, subIndex) => {
                                                                                                    return (
                                                                                                        <td className="align-right">{subEl}</td>
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

                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowedVotes);

