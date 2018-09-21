import React from 'react';
import SiteHeader from '../../components/site-header';
import ChatItem from  './chat-item/index';
import {connect} from 'react-redux';
import classNames from "classnames";
import {getChats, getMessage} from "../../../actions/messager";
import {setBodyModalParamsAction} from "../../../modules/modals";
import './Messenger.css';
import {Form, Text, TextArea, Checkbox} from 'react-form';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import uuid from 'uuid';
import {BlockUpdater} from "../../block-subscriber/index";


const mapStateToProps = state => ({
	account: state.account.account
});

const mapDispatchToProps = dispatch => ({
	getChats: (reqParams) => dispatch(getChats(reqParams)),
	getMessage: (transaction) => dispatch(getMessage(transaction)),
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
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

	updateChatData = (newState) => {
        this.getChats({
            account: this.props.account,
        });
	};

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

	handleSendMessageFormSubmit = async (values) => {

        // recipient: 14423669713677089029
        // deadline: 1440
        // encrypt_message: true
        // encryptedMessageData: bc985f3bdc571d9504e8221bf43c311f57c09eea2bd2e7959e150220cff47992f7d3115364d200ceecd48715374aa00b
        // encryptedMessageNonce: 43e2e35cd6ada65c497c35e8c7057c8b62ed579177df82b00de533de25605514
        // messageToEncryptIsText: true
        // encryptedMessageIsPrunable: true
        // feeATM: 100000000
        // publicKey: bf0ced0472d8ba3df9e21808e98e61b34404aad737e2bae1778cebc698b40f37
        // ecBlockId: 18338875302302929178
        // ecBlockHeight: 0

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

        const feeData = await this.props.submitForm(null, null, {
			...values,
            recipient: this.state.chats[this.state.selectedChat].account,
            feeATM: 0
        }, 'sendMessage')

		if (feeData) {
            if (feeData.errorCode === 4) {
                NotificationManager.error('Message length should not bu grater than 100 symbols.', 'Error', 5000)
            } else {
                const res = await this.props.submitForm(null, null, {
                    ...values,
                    recipient: this.state.chats[this.state.selectedChat].account,
                    secretPhrase: secretPhrase,
                    feeATM: feeData.transactionJSON.feeATM
                }, 'sendMessage');

                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Transaction has been submitted!', null, 5000);
                }
            }
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
													<div
														key={uuid()}
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