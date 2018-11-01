/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import ChatItem from  './chat-item/index';
import {connect} from 'react-redux';
import classNames from "classnames";
import {getChats, getMessage, getChatsAction, getChatHistoryAction} from "../../../actions/messager";
import {setBodyModalParamsAction} from "../../../modules/modals";
import './Messenger.css';
import {Form, Text, TextArea, Checkbox} from 'react-form';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import uuid from 'uuid';
import {BlockUpdater} from "../../block-subscriber/index";
import {formatTimestamp} from "../../../helpers/util/time";
import {Link} from "react-router-dom";
import InfoBox from '../../components/info-box'
import crypto from "../../../helpers/crypto/crypto";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

const mapStateToProps = state => ({
	account: state.account.account,
    is2FA: state.account.is2FA,

});

const mapDispatchToProps = dispatch => ({
	getChats: (reqParams) => dispatch(getChats(reqParams)),
    getChatsAction: (reqParams) => dispatch(getChatsAction(reqParams)),
    getMessage: (transaction) => dispatch(getMessage(transaction)),
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

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
            this.updateChatData(this.props);
        }
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.updateChatData(this.props);
        });
	};

	componentWillReceiveProps(newState) {
        this.updateChatData(newState)
	}

	updateChatData = async (newState) => {
        this.getChats({
            account: this.props.account,
        });

        if (newState.match.params.chat) {
            const chatHistory = await getChatHistoryAction({account2: newState.match.params.chat})

            if (chatHistory) {
                this.setState({
                    chatHistory: chatHistory.chatHistory
                })
			}
		}
	};

	getChats = async (reqParams) => {

		// TODO: fixed temp
		let chats = await getChatsAction(reqParams);
		let correctChatsAccounts = await this.props.getChats(reqParams);

		chats = chats.chats.map((el, index) => {
			return {...el, ...correctChatsAccounts[index]}
		});

        if (chats) {
			this.setState({
				...this.state,
				chats: chats,
			});
		}
	};

    getFormApi = async (formApi) => {
		this.setState({formApi})
	};

	handleSendMessageFormSubmit = async (values) => {
        if (!values.message || values.message.length === 0 || !(/\S/.test(values.message))) {
            NotificationManager.error('Please write your message.', 'Error', 5000);
            return;
        }

        if (values.messageToEncrypt) {
            values = {
				...values,
                messageToEncrypt: values.message,
                // message: null
            };
            delete values.message;
		}

		if (!values.secretPhrase) {
            NotificationManager.error('Enter secret phrase.', 'Error', 5000);
            return;
        }

		const secretPhrase = JSON.parse(JSON.stringify(values.secretPhrase));
        // delete values.secretPhrase;


		const res = await this.props.submitForm( {
			...values,
			recipient: this.props.match.params.chat,
			secretPhrase: secretPhrase,
			feeATM: 4
		}, 'sendMessage');

        if (res.errorCode === 4) {
            NotificationManager.error('Message length should not bu grater than 100 symbols.', 'Error', 5000);
            return;
        }
        if (res.errorCode === 6) {
            NotificationManager.error('Incorrect secret phrase.', 'Error', 5000);
			return;
        }
		if (!res.errorCode) {
            NotificationManager.success('Message has been submitted!', null, 5000);
            if (this.state.formApi) {
            	this.state.formApi.setValue('message', null);
            	this.state.formApi.setValue('secretPhrase', null);
            	this.state.formApi.setValue('code2FA', null);
            }
        }
    };


    // shouldComponentUpdate = (nextProps, nextState) => {
    //     const newMessages = nextState.chatHistory ? nextState.chatHistory.map((el) => {
    //         return el.transaction
    //     }) : null;
    //
    //     const messages = this.state.chatHistory ? this.state.chatHistory.map((el) => {
    //         return el.transaction
    //     }) : null;
    //
    //     const newChat = nextState.chats ? nextState.chats.map((el) => {
    //         return el.accountRS
    //     }) : null;
    //
    //     const chats = this.state.chats ? this.state.chats.map((el) => {
    //
    //         return el.accountRS
    //     }) : null;
    //
    //     if ((newMessages && messages && newChat && chats)) {
    //         const comparation = this.isArraysEqual(newMessages, messages);
    //         const comparationchats = this.isArraysEqual(newChat, chats);
    //
	// 		if (comparation) return true;
	// 		if (comparationchats) return true;
    //     }
    //
    //     if (this.props.match.params.chat !== nextProps.match.params.chat) {
    //         return true;
    //     }
    //
    //     if ((!messages ) && (!chats)) {
    //         return true;
	// 	}
    // }
    //
    // /*
    // * Returns true if every element of array are equal
    // * */
    // isArraysEqual = (a, b) => {
    //     let result = true;
	// 	if (a && b) {
    //         result = a.every((el, index) => {
    //             return el === b[index]
    //         })
    //
    //         return !result
	// 	} else {
	// 		return false
	// 	}
    // }

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
				>
                    <a
                        onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', null)}
                        className="btn primary"
                    >
                        Compose message
                    </a>
				</SiteHeader>
				<div className="page-body container-fluid flexible-height overflow-hidden">
					<div className="messenger">
						<div className="row">
							<div className="col-md-3">
								<div className="left-bar">
									<div className="card card-full-screen no-padding scroll">
										{
											this.state.chats &&
											<React.Fragment>
												{
                                                    !!this.state.chats.length &&
                                                    this.state.chats.map((el, index) => {

                                                        return (
                                                            <Link
                                                                to={'/messenger/' + el.account}
                                                                key={uuid()}
                                                                style={{display: "block"}}
                                                                className={classNames({
                                                                    "chat-item": true,
                                                                    "active": el.account === this.props.match.params.chat
                                                                })}
																// onClick={() => this.handleChatSelect(index)}
                                                            >
                                                                <div className="chat-box-item">
                                                                    <div className="chat-box-rs">
                                                                        {el.accountRS}
                                                                    </div>
                                                                    <div className="chat-date">
                                                                        {this.props.formatTimestamp(el.lastMessageTime)}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })
												}
												{
                                                    !(!!this.state.chats.length) &&
													<InfoBox>
														No messages found.
													</InfoBox>
                                                }
											</React.Fragment>
										}
										{
                                            !this.state.chats &&
                                            <div
                                                style={{
                                                    paddingLeft: 47.5,
													paddingTop: 20
                                                }}
                                                className={'loader-box'}
                                            >
                                                <div className="ball-pulse">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
										}

									</div>
								</div>
							</div>
							<div className="col-md-9">
								<div className="right-bar">
										<div className="card card-full-screen no-padding">
											<div className="chatting-box">

												{
                                                    this.state.chatHistory &&
                                                    !!this.state.chatHistory.length &&
													this.state.chatHistory.map((el, index) => {
														const message = this.props.getMessage(el);

														return (
															<ChatItem
																key={uuid()}
																{...this.props}
																{...el}
																message={message}
																messageFormat={message.format}
															/>
														);
													})
												}

											</div>
                                            <Form
                                                onSubmit={(values) => this.handleSendMessageFormSubmit(values)}
                                                getApi={this.getFormApi}
                                                render={({
                                                             submitForm, values, addValue, removeValue, setValue, getFormState
                                                         }) => (
                                                    <form className="compose-message-box" onSubmit={submitForm}>
                                                        <div className="top-bar">
															<TextArea
                                                                className={"form-control"}
                                                                field={'message'}
                                                                rows="2"
                                                                placeholder={'Message'}/>
                                                        </div>
                                                        <div className="bottom-bar">
                                                            <div className="encrypt-message-box">
                                                                <div className="input-group-app">
                                                                    <div
                                                                        className="form-check custom-checkbox encrypt-message-checkbox">
                                                                        <Checkbox
                                                                            className="form-check-input custom-control-input"
                                                                            type="checkbox"
                                                                            field="messageToEncrypt"/>
                                                                        <label
                                                                            className="form-check-label custom-control-label">
                                                                            Encrypt message
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Text
                                                                className={"form-control"}
                                                                field={'secretPhrase'}
                                                                placeholder={'Secret Phrase'}
                                                                type="password"/>
															{
																this.props.is2FA &&
                                                                <Text
                                                                    className={"form-control"}
                                                                    field={'code2FA'}
                                                                    placeholder={'2FA Code'}
                                                                    type="password"/>
															}

															<button type="submit" className="btn blue btn-primary">
																Send Message
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            />

										</div>

                                    {
                                        !this.state.chatHistory &&
                                        <ContentLoader/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);