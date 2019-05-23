/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import { setModalData } from '../../../../modules/modals';
import converters from "../../../../helpers/converters";
import crypto from "../../../../helpers/crypto/crypto";
import InfoBox from '../../../components/info-box'
import { validateTokenAction } from "../../../../actions/account";
import { NotificationManager } from 'react-notifications';

import QRCode from 'qrcode.react';

import ModalBody from '../../../components/modals/modal-body';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';
import CustomTextArea from '../../../components/form-components/text-area';
import TextualInputComponent from '../../../components/form-components/textual-input';


class TokenGenerationValidation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            generatedToken: null,
            validateToken: null
        };
    }

    handleFormSubmit = async (values) => {
        if (!values.data || values.data.length === 0) {
            NotificationManager.error('Data is required.', 'Error', 5000);
            return;
        }
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const token = await this.props.generateTokenAPL(values.data, values.secretPhrase);

        this.setState({
            generatedToken: token
        });
    };

    handleValidateToken = async (values) => {
        const validateToken = await this.props.validateTokenAction({
            token: values.token,
            website: values.website
        });

        if (validateToken) {
            if (validateToken.valid) {
                NotificationManager.success('Notification message is valid!')
            } else {
                NotificationManager.error('Notification message is invalid!')
            }
        }
    };

    render() {
        return (
            <ModalBody
                modalTitle={'Token generation / validation'}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
            >
                <TabulationBody
                    className={'p-0'}
                >
                    <TabContaier sectionName={'Generate token'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleFormSubmit(values)}
                            className={'p-0 transparent gray-form'}
                            isDisabe2FA
                            isPour
                            submitButtonName={'Generate'}
                        >
                            <CustomTextArea
                                label={'Data'}
                                field={'data'}
                                placeholder={'Website or text'}
                            />
                            {
                                this.state.generatedToken &&
                                <>
                                    <p style={{ marginBottom: 18 }}>The generated token is:</p>
                                    <InfoBox info>
                                        <div className="token word-brake">{this.state.generatedToken}</div>
                                    </InfoBox>
                                    <div className="qr-code-image">
                                        <QRCode value={this.state.generatedToken} size={100} />
                                    </div>
                                </>
                            }
                        </ModalBody>
                    </TabContaier>
                    <TabContaier sectionName={'Validate token'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleValidateToken(values)}
                            className={'p-0 transparent gray-form'}
                            isDisabe2FA
                            isPour
                            submitButtonName={'Validate'}
                        >
                            {
                                this.state.generatedToken &&
                                <>
                                    <p style={{ marginBottom: 18 }}>The generated token is:</p>
                                    <InfoBox info>
                                        <div className="token word-brake">{this.state.generatedToken}</div>
                                    </InfoBox>
                                    <div className="qr-code-image">
                                        <QRCode value={this.state.generatedToken} size={100} />
                                    </div>
                                </>
                            }
                            <CustomTextArea
                                label={'Data'}
                                field={'website'}
                                placeholder={'Website or text'}
                            />
                            <TextualInputComponent
                                label={'Token'}
                                field="token"
                                placeholder="Token"
                                type={"text"}
                            />
                        </ModalBody>
                    </TabContaier>
                </TabulationBody>
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    generateTokenAPL: (message, secretPhrase) => dispatch(converters.generateTokenAPL(message, secretPhrase)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    validateTokenAction: (requestParams) => dispatch(validateTokenAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenGenerationValidation);
