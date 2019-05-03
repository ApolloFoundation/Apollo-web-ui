import React from 'react';
import ChatItem from '../chat-item';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader';
import InfoBox from '../../../components/info-box';
import {withRouter} from 'react-router-dom';

// components
import ChatForm from './chat-form';

class Chat extends React.Component {
    state = {textareaCount: 0};

    render () {
        const {chatMessages, match: {params: {chat}}} = this.props;

        return (
            <>
                {
                    chat && window.innerWidth < 767 &&
                    <InfoBox default className={'mb-3'}>
                        Chat with <strong className={'blue-text'}>{chat}</strong>
                    </InfoBox>
                }
                <div className="card card-full-screen p-0">
                    <div className="chatting-box">
                        {
                            chatMessages &&
                            !!chatMessages.length &&
                            chatMessages.map((el, index) => {
                                return (
                                    <ChatItem
                                        key={index}
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
            </>
        )
    }
}

const mapStateToProps = state => ({
    chatMessages: state.messages.chatMessages
});


export default connect(mapStateToProps)(withRouter(Chat));