import React from 'react';
import {Form, Text, TextArea} from 'react-form';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {handleSendMessageFormSubmit} from './handleFormSubmit';
import {CheckboxFormInput} from "../../../components/form-components/check-button-input";
import classNames from "classnames";

class ChatForm extends React.PureComponent {
    state = {
        isPending: false,
    };

    handleSendMessageFormSubmit = async (values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            await this.props.handleSendMessageFormSubmit({
                ...values,
                recipient: this.props.match.params.chat,
                resetForm: this.resetForm
            });
            this.setState({isPending: false});
        }
    };

    resetForm = () => {
        if (this.props.form) this.props.form.resetAll();
    };

    render() {
        return (
            <Form
                defaultValues={{textareaCount: 0}}
                onSubmit={(values) => this.handleSendMessageFormSubmit(values)}
                getApi={this.props.getFormApi}
                render={({
                             submitForm, values, addValue, removeValue, setValue, getFormState
                         }) => (
                    <form className="compose-message-box" onSubmit={submitForm}>
                        <div className={'form-group-app'}>
                            <div className="top-bar">
                                <div className={"textareaCount"}>
                                    {values.textareaCount > 100 ?
                                        <div className={"textareaCount-message"}>Message is too long</div> :
                                        <div>
                                            <div className={'textareaCount-text'}>{100 - values.textareaCount}</div>
                                            /100</div>
                                    }
                                </div>
                                <TextArea
                                    className={"form-control"}
                                    field={'message'}
                                    rows="3"
                                    placeholder={'Message'}
                                    onChange={(text) => setValue('textareaCount', text.length)}
                                />
                            </div>
                            <div className="bottom-bar">
                                <div className={'bottom-bar-wrap'}>
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
                                    <div className={'bottom-bar-input-wrap'}>
                                        <Text
                                            className={"form-control"}
                                            field={'secretPhrase'}
                                            placeholder={'Secret Phrase'}
                                            type="password"
                                        />
                                        {this.props.is2FA && (
                                            <Text
                                                className={"form-control"}
                                                field={'code2FA'}
                                                placeholder={'2FA Code'}
                                                type="password"
                                            />
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className={classNames({
                                        "btn btn-green submit-button": true,
                                        "loading btn-green-disabled": this.state.isPending,
                                    })}
                                >
                                    <div className="button-loader">
                                        <div className="ball-pulse">
                                            <div/>
                                            <div/>
                                            <div/>
                                        </div>
                                    </div>
                                    <span className={'button-text'}>Send Message</span>
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
