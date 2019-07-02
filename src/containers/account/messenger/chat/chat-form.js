import React from 'react';
import {Checkbox, Form, Text, TextArea} from 'react-form';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {handleSendMessageFormSubmit} from './handleFormSubmit';
import {CheckboxFormInput} from "../../../components/form-components/check-button-input";

class ChatForm extends React.PureComponent {
    state = {
        textareaCount: 0
    };

    handleSendMessageFormSubmit = (values) =>
        this.props.handleSendMessageFormSubmit({...values, recipient: this.props.match.params.chat, resetForm: this.resetForm});

    resetForm = () => {
        if (this.props.form) this.props.form.resetAll();
        this.setState({
            textareaCount: 0
        })
    };

    render() {
        return (
            <Form
                onSubmit={(values) => this.handleSendMessageFormSubmit(values)}
                getApi={this.props.getFormApi}
                render={({
                             submitForm, values, addValue, removeValue, setValue, getFormState
                         }) => (
                    <form className="compose-message-box" onSubmit={submitForm}>
                        <div className={'form-group-app'}>
                            <div className="top-bar">
                                <div className={"textareaCount"}>
                                    {this.state.textareaCount > 100 ?
                                        <div className={"textareaCount-message"}>Message is too long</div> :
                                        <div>
                                            <div className={'textareaCount-text'}>{100 - this.state.textareaCount}</div>
                                            /100</div>
                                    }
                                </div>
                                <TextArea
                                    className={"form-control"}
                                    field={'message'}
                                    rows="3"
                                    placeholder={'Message'}
                                    onChange={(text) => this.setState({textareaCount: text.length})}
                                />
                            </div>
                            <div className="bottom-bar">
                                <CheckboxFormInput
                                    className={'mb-0'}
                                    setValue={setValue}
                                    checkboxes={[
                                        {
                                            field: 'messageToEncrypt',
                                            label: 'Encrypt message'
                                        }
                                    ]}
                                />
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

                                <button type="submit" className="btn btn-green">
                                    Send Message
                                </button>
                            </div>
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

const mapStateToProps = state => ({
    is2FA: state.account.is2FA
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatForm));
