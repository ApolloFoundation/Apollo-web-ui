import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import classNames from "classnames";
import {getMessages} from "../../../actions/messager";

import './Messenger.css';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getMessages: (reqParams) => dispatch(getMessages(reqParams))
});

@connect(mapStateToProps, mapDispatchToProps)
class Messenger extends React.Component {
    constructor(props) {
        super(props);
    };

    state = {
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
        chats: null,
        selectedChat: null,
        chatHistory: null
    };

    componentDidMount () {
        this.getMessages({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    componentWillReceiveProps(newState) {
        console.log(this.props.account);
        this.getMessages({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    }

    getMessages = async (reqParams) => {
        const chats = await this.props.getMessages(reqParams);

        if (chats) {
            this.setState({
                ...this.state,
                chats: chats.transactions
            });
        }
    };

    handleChatSelect = (index) => {
        this.setState({
            ...this.state,
            selectedChat: index
        })
    };

    render (){
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Messenger'}
                />
                <div className="page-body container-fluid flexible-height overflow-hidden">
                    <div className="messenger">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="left-bar">
                                    <div className="card card-full-screen no-padding scroll">
                                        {
                                            this.state.chats &&
                                            this.state.chats.map((el, index) => {
                                                return (
                                                    <div
                                                        className={classNames({
                                                            "chat-item": true,
                                                            "active": this.state.selectedChat === index
                                                        })}
                                                        onClick={() => this.handleChatSelect(index)}
                                                    >
                                                        <div className="chat-box-item">
                                                            <div className="chat-box-rs">
                                                                {el.senderRS}
                                                            </div>
                                                            <div className="chat-date">
                                                                {el.timestamp}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="right-bar">
                                    {
                                        this.state.chatHistory && this.state.selectedChat &&
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
                                    }
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