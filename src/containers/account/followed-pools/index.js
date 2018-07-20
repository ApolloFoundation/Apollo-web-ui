import React from 'react';
import SiteHeader from '../../components/site-header';
import Pie from './pie-diagram';

import '../messenger/Messenger.scss'
import './FollowedPools.css'
import classNames from "classnames";


class FollowedVotes extends React.Component {
    constructor(props) {
        super(props);

        this.state =  {
            data: [5, 12, 8, 3, 10]
        }
    }
    render() {
        const colors = ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'];

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Followed messages'}
                />
                <div className="page-body container-fluid">
                    <div className="messenger">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="left-bar">
                                    <div className="card card-full-screen no-padding">
                                        <div className="chat-item">
                                            <div className="chat-box-item">
                                                <div className="chat-box-rs">
                                                    Lambo or Pay off Mortgage
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
                                                        <p>Lambo or Pay off Mortgage</p>
                                                    </div>
                                                    <div className="account-bar">
                                                        <div className="information">
                                                            <div className="title">Account:&nbsp;&nbsp;</div>
                                                            <div className="content">APL-KUM3-5N3W-FZRJ-GSZX9</div>
                                                        </div>
                                                        <div className="information">
                                                            <div className="title">Poll ID:&nbsp;&nbsp;</div>
                                                            <div className="content">17312174787897687680</div>
                                                        </div>
                                                    </div>
                                                    <div className="description-bar">
                                                        <p>
                                                            Lambo/Rari or Pay off Mortgage. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                                                        </p>
                                                    </div>
                                                    <div className="btn btn-primary blue">Vote in poll</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <Pie
                                                data={ this.state.data }
                                                radius={ 150 }
                                                hole={ 0 }
                                                colors={ colors }
                                                strokeWidth={ 1 }
                                                stroke={ 'rgba(0, 0, 0, .5)' }
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="card card-flexible">

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="right-bar">
                                                <div className="form-group height-auto">
                                                    <div className="form-title">
                                                        <p>Poll results</p>
                                                    </div>
                                                    <div className="transaction-table no-min-height">
                                                        <div className="transaction-table-body padding-only-top">
                                                            <table>
                                                                <thead>
                                                                <tr>
                                                                    <td>Type</td>
                                                                    <td className="align-right">Lambo/Rari</td>
                                                                    <td className="align-right">Pay off Mortage</td>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr>
                                                                    <td>Result</td>
                                                                    <td>4</td>
                                                                    <td>3</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Result</td>
                                                                    <td>4</td>
                                                                    <td>3</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Result</td>
                                                                    <td>4</td>
                                                                    <td>3</td>
                                                                </tr>
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group height-auto">
                                                    <div className="form-title">
                                                        <p>Votes cast (7)</p>
                                                    </div>
                                                    <div className="transaction-table no-min-height">
                                                        <div className="transaction-table-body padding-only-top">
                                                            <table>
                                                                <thead>
                                                                <tr>
                                                                    <td>Voter</td>
                                                                    <td className="align-right">Lambo/Rari</td>
                                                                    <td className="align-right">Pay off Mortage</td>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr>
                                                                    <td className="blue-link-text">
                                                                        <a>APL-TVKC-MPYD-XV3B-8DTU9</a>
                                                                    </td>
                                                                    <td></td>
                                                                    <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="blue-link-text">
                                                                        <a>APL-58BD-EDBA-Q4DG-EBDTW</a>
                                                                    </td>
                                                                    <td></td>
                                                                    <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="blue-link-text">
                                                                        <a>APL-NZKH-MZRE-2CTT-98NPZ</a>
                                                                    </td>
                                                                    <td>1</td>
                                                                    <td></td>
                                                                </tr>
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        className={classNames({
                                            'btn' : true,
                                            'btn-left' : true,
                                            'disabled' : true
                                        })}
                                    > Previous </a>
                                    <div className='pagination-nav'>
                                        <span>{1}</span>
                                        <span>&hellip;</span>
                                        <span>{3}</span>
                                    </div>
                                    <a
                                        className={classNames({
                                            'btn' : true,
                                            'btn-right' : true,
                                            'disabled' : false
                                        })}
                                    > Next </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default FollowedVotes;

