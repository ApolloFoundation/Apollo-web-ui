import React from 'react';
import {Form, TextArea, Checkbox, Text} from 'react-form';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {handleSendMessageFormSubmit} from './handleFormSubmit';

class ChatForm extends React.PureComponent {
    state = {
        textareaCount:0
    };

    handleSendMessageFormSubmit = (values) => 
        this.props.handleSendMessageFormSubmit(
            {...values, recipient: this.props.match.params.chat, resetForm: this.resetForm}, 
            this.state.form,
        );
    
    resetForm = () => {
        this.setState({
            textareaCount: 0
        })
    };

    getFormApi = (form) => {
        this.setState({
            form 
        })
    };

    render () {
        return (
            <Form
                onSubmit={(values) => this.handleSendMessageFormSubmit(values)}
                getApi={this.getFormApi}
                render={({
                            submitForm, values, addValue, removeValue, setValue, getFormState
                        }) => (
                    <form className="compose-message-box" onSubmit={submitForm}>
                        <div className="top-bar">
                            <div className={"textareaCount"}>
                                {this.state.textareaCount > 100 ?
                                    <div className={"textareaCount-message"}>Message is too long</div> :
                                    <div><div className={'textareaCount-text'}>{100 - this.state.textareaCount}</div>/100</div>
                                }
                            </div>
                            <TextArea
                                className={"form-control"}
                                field={'message'}
                                rows="2"
                                placeholder={'Message'}
                                onChange={(text) => this.setState({textareaCount: text.length})}
                            />
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
        )
    }
}

const mapDispatchToProps = {
    handleSendMessageFormSubmit
};

export default connect(null, mapDispatchToProps)(withRouter(ChatForm));