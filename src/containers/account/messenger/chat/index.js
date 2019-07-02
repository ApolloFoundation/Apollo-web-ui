import React from 'react';
import ChatItem from '../chat-item';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader';
import InfoBox from '../../../components/info-box';
import {withRouter} from 'react-router-dom';
// components
import ChatForm from './chat-form';

class Chat extends React.Component {
    state = {
        textareaCount: 0,
        form: null
    };

    componentDidUpdate(prevProps) {
        if (this.props.match.params.chat !== prevProps.match.params.chat && this.state.form) {
            this.state.form.resetAll();
        }
    }

    getFormApi = (form) => {
        this.setState({
            form
        })
    };

    render() {
        const {chatMessages, match: {params: {chat}}} = this.props;

        return (
            <>
                {chat && window.innerWidth < 767 && (
                    <InfoBox default className={'mb-3'}>
                        Chat with <strong className={'blue-text'}>{chat}</strong>
                    </InfoBox>
                )}
                <div className="card p-0 h-100">
                    {chat ? (
                        <>
                            <div className="chatting-box">
                                {chatMessages ? (
                                    chatMessages.map((el, index) => (
                                        <ChatItem
                                            key={index}
                                            {...el}
                                        />
                                    ))
                                ) : (
                                    <ContentLoader/>
                                )}
                            </div>
                            <ChatForm
                                getFormApi={this.getFormApi}
                                form={this.state.form}
                            />
                        </>
                    ) : (
                        <InfoBox>
                            Please select the chat.
                        </InfoBox>
                    )}
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    chatMessages: state.messages.chatMessages
});


export default connect(mapStateToProps)(withRouter(Chat));