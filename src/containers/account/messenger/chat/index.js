import React from 'react';
import ChatItem from '../chat-item';
import uuid from 'uuid';
import {Form, Text, TextArea, Checkbox} from 'react-form';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader';
import InfoBox from '../../../components/info-box';
import {withRouter} from 'react-router-dom';
import {handleSendMessageFormSubmit} from './handleFormSubmit';

// components
import ChatForm from './chat-form';

class Chat extends React.Component {
    state = {textareaCount: 0};

    getFormApi = (form) => {
        this.setState({
            form 
        })
    }

    handleSendMessageFormSubmit = (values) => 
        this.props.handleSendMessageFormSubmit(
            {...values, recipient: this.props.match.params.chat}, 
            this.state.form
        );
        

    render () {
        const {chatMessages} = this.props;

        return (
            <div className="card card-full-screen p-0">
                <div className="chatting-box">
                    {
                        chatMessages &&
                        !!chatMessages.length &&
                        chatMessages.map((el, index) => {
                            return (
                                <ChatItem
                                    key={uuid()}
                                    {...el}
                                />
                            );
                        })
                    }
                    {
                        chatMessages && 
                        !chatMessages.length && 
                        <InfoBox>
                            Please select the chat.
                        </InfoBox>
                    }
                    {
                        !chatMessages &&
                        <ContentLoader/>
                    }
                </div>
                <ChatForm />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    chatMessages: state.messages.chatMessages
})

const mapDispatchToProps = dispatch => ({
    handleSendMessageFormSubmit: (reqParams, form) => dispatch(handleSendMessageFormSubmit(reqParams, form))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Chat));