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

const mapStateToProps = state => ({
	account: state.account.account
});

const mapDispatchToProps = dispatch => ({
	getChats: (reqParams) => dispatch(getChats(reqParams)),
    getChatsAction: (reqParams) => dispatch(getChatsAction(reqParams)),
    getMessage: (transaction) => dispatch(getMessage(transaction)),
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
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
        console.log(newState.match.params);
        if (newState.match.params.chat) {
            const chatHistory = await getChatHistoryAction({account2: newState.match.params.chat})

            console.log(chatHistory);

            if (chatHistory) {
                this.setState({
                    chatHistory: chatHistory.chatHistory
                }, () => {
                    console.log(this.state.chatHistory);
                })
			}
		}
	};

	getChats = async (reqParams) => {

		// TODO: fixed temp
		let chats = await getChatsAction(reqParams);
		let correctChatsAccounts = await this.props.getChats(reqParams);

        // chats = chats.chats.map((el, index) => {
         //    console.log(correctChatsAccounts[index].data);
         //    console.log(el);
         //    return {...el, ...(correctChatsAccounts[index].data)}
		// });

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

	handleSendMessageFormSubmit = async (values) => {
		if (values.messageToEncrypt) {
            values = {
				...values,
                messageToEncrypt: values.message
            };
            delete values.message;
		}

		if (!values.secretPhrase) {
            NotificationManager.error('Enter secret phrase.', 'Error', 5000);
            return;
        }

		const secretPhrase = JSON.parse(JSON.stringify(values.secretPhrase));
        // delete values.secretPhrase;


		const res = await this.props.submitForm(null, null, {
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
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Transaction has been submitted!', null, 5000);
        }
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

									</div>
								</div>
							</div>
							<div className="col-md-9">
								<div className="right-bar">
									{
										this.state.chatHistory &&
										<div className="card card-full-screen no-padding">
											<div className="chatting-box">

												{
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
												render={({
													         submitForm, values, addValue, removeValue, setValue, getFormState
												         }) => (
													<form className="compose-message-box" onSubmit={submitForm}>
														<div className="top-bar">
															<TextArea field={'message'} rows="4" placeholder={'Message'}/>
														</div>
														<div
															className="bottom-bar"
															style={{height: 51}}
														>
															<div className="encrypt-message-box">
																<div className="input-group-app">
																	<div className="encrypt-message-checkbox">
																		<Checkbox field={'messageToEncrypt'} type="checkbox"/>
																	</div>
																	<label>Encrypt message</label>
																</div>
															</div>
															<Text field={'secretPhrase'} placeholder={'Secret Phrase'} type="password"/>
															<button type="submit" className="btn blue btn-primary">Send Message</button>
														</div>
													</form>
												)}
											/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);