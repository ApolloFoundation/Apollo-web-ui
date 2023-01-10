import React, { useCallback, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {handleSendMessageFormSubmit} from './handleFormSubmit';
import classNames from "classnames";
import { Form, FormikProvider, useFormik } from 'formik';
import CustomTextArea from 'containers/components/form-components/text-area1';
import CheckboxFormInput from 'containers/components/check-button-input';
import TextualInputComponent from 'containers/components/form-components/textual-input/textual-input1';
import styles from './index.module.scss';

// TODO finish update styles
const ChatForm = (props) => {
    const [isPending, setIsPending] = useState(false);
    let { chat } = useParams();

    const handleSendMessageFormSubmit = useCallback(async (values) => {
        setIsPending(true);
        await props.handleSendMessageFormSubmit({
            ...values,
            recipient: chat,
            resetForm: formik.resetForm,    
        });
        setIsPending(false);
    }, [props.handleSendMessageFormSubmit, chat]);

    const formik = useFormik({
        initialValues: {
            textareaCount: 0,
            message: '',
        },
        onSubmit: handleSendMessageFormSubmit,
    });


    useEffect(() => {
        formik.setFieldValue('textareaCount', formik.values.message?.length || 0);
    }, [formik.values.message]);

    useEffect(() => {
        formik.resetForm();
    }, [chat]);

    return (
        <FormikProvider value={formik}>
                <Form className="compose-message-box" onSubmit={formik.handleSubmit}>
                    <div className='form-group-app'>
                        <div className="top-bar">
                            <div className="textareaCount">
                                {formik.values.textareaCount > 100 ?
                                    <div className="textareaCount-message">Message is too long</div> :
                                    <div>
                                        <div className='textareaCount-text'>{100 - formik.values.textareaCount}</div>
                                        /100
                                    </div>
                                }
                            </div>
                            <CustomTextArea
                                name='message'
                                rows="3"
                                placeholder='Message'
                                className="mb-0"
                            />
                        </div>
                        <div className={styles.chatInputs}>
                            <div className={classNames(styles.chatInputs, styles.chatInputItem)}>
                                <CheckboxFormInput
                                    label="Encrypt message"
                                    name="messageToEncrypt"
                                    id="messageToEncrypt"
                                    className="mb-0"
                                />
                                <div className={styles.chatInput}>
                                    <TextualInputComponent
                                        name='secretPhrase'
                                        placeholder='Secret Phrase'
                                        type="password"
                                        className="mb-0"
                                    />
                                </div>
                                {props.is2FA && (
                                    <TextualInputComponent
                                        name='code2FA'
                                        placeholder='2FA Code'
                                        type="password"
                                        className="mb-0"
                                    />
                                )}
                            </div>
                            <button
                                type="submit"
                                className={classNames({
                                    "btn btn-green submit-button": true,
                                    "loading btn-green-disabled": isPending,
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
                </Form>
        </FormikProvider>
    );
}

const mapDispatchToProps = {
    handleSendMessageFormSubmit
};

const mapStateToProps = state => ({
    is2FA: state.account.is2FA
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatForm);
