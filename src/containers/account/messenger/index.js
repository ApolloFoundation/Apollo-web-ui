import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import classNames from "classnames";
import {getChats, getMessage} from "../../../actions/messager";

import './Messenger.css';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getChats: (reqParams) => dispatch(getChats(reqParams)),
    getMessage: (transaction) => dispatch(getMessage(transaction)),
});

@connect(mapStateToProps, mapDispatchToProps)
class Messenger extends React.Component {
    constructor(props) {
        super(props);
    };

    state = {
        chats: null,
        selectedChat: null,
        chatHistory: null
    };

    componentDidMount () {
        if (this.props.account) {
            this.getChats({
                account: this.props.account,
            });
        }
    };

    componentWillReceiveProps(newState) {
        this.getChats({
            account: this.props.account,
        });
    }

    getChats = async (reqParams) => {
        const chats = await this.props.getChats(reqParams);

        if (chats) {
            this.setState({
                ...this.state,
                chats: chats,
            });
        }
    };

    handleChatSelect = (index) => {

        this.setState({
            ...this.state,
            selectedChat: index,
            chatHistory: this.state.chats[index].messages
        })
    };

    render (){
        if (this.state.chatHistory) {
            this.state.chatHistory.map((el, index) => {
                this.props.getMessage(el)
            })
        }
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
                                                                {el.accountRS}
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
                                        this.state.chatHistory &&
                                        <div className="card card-full-screen no-padding">
                                            <div className="chatting-box">

                                                {
                                                    this.state.chatHistory.map((el, index) => {
                                                        const message = this.props.getMessage(el);

                                                        return (
                                                            <div className={classNames({
                                                                'message-box': true,
                                                                'encrypted' : message.format === 'encrypted',
                                                                'outgoing': this.props.account === el.sender,
                                                                'incoming': this.props.account !== el.sender,
                                                            })}>
                                                                <div className="message">
                                                                    <p>
                                                                        {
                                                                            message.message
                                                                        }
                                                                        {
                                                                            message.format === 'encrypted' &&
                                                                                [
                                                                                    <a className='action'>
                                                                                        < i className="zmdi zmdi-lock-open" />
                                                                                    </a>,
                                                                                    <span className="message-text">&nbsp;&nbsp;Message is encrypted</span>
                                                                                ]
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }

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