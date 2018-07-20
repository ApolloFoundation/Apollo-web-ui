import React from 'react';
import SiteHeader from '../../components/site-header';
import classNames from "classnames";

import './Messenger.css';

class Messenger extends React.Component {
    componrtDidMount (props) {

    }



    render (){
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Messenger'}
                    showPrivateTransactions={'ledger'}
                />
                <div className="page-body container-fluid flexible-height overflow-hidden">
                    <div className="messenger">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="left-bar">
                                    <div className="card card-full-screen no-padding">
                                        <div className="chat-item">
                                            <div className="chat-box-item">
                                                <div className="chat-box-rs">
                                                    APL-R82Y-ALBJ-72A3-HZPXU
                                                </div>
                                                <div className="chat-date">
                                                    6/16/2018 10:44:44
                                                </div>
                                            </div>
                                            <div className="chat-box-item">
                                                <div className="chat-box-rs">
                                                    APL-R82Y-ALBJ-72A3-HZPXU
                                                </div>
                                                <div className="chat-date">
                                                    6/16/2018 10:44:44
                                                </div>
                                            </div>
                                            <div className="chat-box-item">
                                                <div className="chat-box-rs">
                                                    APL-R82Y-ALBJ-72A3-HZPXU
                                                </div>
                                                <div className="chat-date">
                                                    6/16/2018 10:44:44
                                                </div>
                                            </div>
                                            <div className="chat-box-item">
                                                <div className="chat-box-rs">
                                                    APL-R82Y-ALBJ-72A3-HZPXU
                                                </div>
                                                <div className="chat-date">
                                                    6/16/2018 10:44:44
                                                </div>
                                            </div>
                                            <div className="chat-box-item">
                                                <div className="chat-box-rs">
                                                    APL-R82Y-ALBJ-72A3-HZPXU
                                                </div>
                                                <div className="chat-date">
                                                    6/16/2018 10:44:44
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="right-bar">
                                    <div className="card card-full-screen">
                                        <div className="chatting-box">

                                            <div className="message-box outgoing">
                                                <div className="message">
                                                    <p>
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="message-box outgoing encrypted">
                                                <div className="message">
                                                    <p>Message is encrypted.</p>
                                                </div>
                                            </div>

                                            <div className="message-box incoming encrypted">
                                                <div className="message">
                                                    <p>Message is encrypted.</p>
                                                </div>
                                            </div>
                                            <div className="message-box incoming">
                                                <div className="message">
                                                    <p>
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="date-separator">

                                            </div>

                                        </div>
                                        <div className="compose-message-box">
                                            <div className="top-bar">
                                                <textarea name=""rows="4" placeholder={'Message'}/>
                                            </div>
                                            <div className="bottom-bar">
                                                <div className="encrypt-message-box">
                                                    <div className="input-group">
                                                        <div className="encrypt-message-checkbox">
                                                            <input type="checkbox"/>
                                                        </div>
                                                        <label>Encrypt message</label>
                                                    </div>
                                                </div>
                                                <input className={'passphrase'} type="text"/>
                                                <a className="btn blue btn-primary">Send Message</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Messenger;