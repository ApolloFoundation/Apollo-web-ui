/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { connect } from 'react-redux';
import React from 'react';
import './Login.css'
import { getAccountDataAction, getAccountDataBySecretPhrasseAction } from '../../../actions/login';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getConstantsAction} from '../../../actions/login'

import ModalBody from '../../components/modals/modal-body';
import TabulationBody from '../../components/tabulator/tabuator-body';
import TabContaier from '../../components/tabulator/tab-container';
import TextualInputComponent from '../../components/form-components/textual-input';
import AccountRSFormInput from '../../components/form-components/account-rs'
import InfoBox from '../../components/info-box';


class Login extends React.Component {
    state = {
        activeTab: 0
    };

    componentDidMount () {
        this.props.getConstantsAction();
    }

    enterAccount = (values) => {
        this.props.getAccountAction({
            account: values.accountRS
        });
    };

    enterAccountByPassphrase = (values) => {
        this.props.getAccountDataBySecretPhrasseAction({
            secretPhrase: values.secretPhrase
        });
    };

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    };

    EnterAccountIDCustomFooter = () => (
        <div className="btn-box align-buttons-inside absolute right-conner wide">
            <a
                className="btn btn-left round round-bottom-left"
                onClick={() => this.props.setBodyModalParamsAction('CREATE_USER')}
            >
                Create account
            </a>
            <a
                className="btn btn-left round blue round-top-right"
                onClick={() => this.props.setBodyModalParamsAction('IMPORT_ACCOUNT')}
            >
                Import account
            </a>

            <button
                type="submit"
                name={'closeModal'}
                className="btn btn-right blue round round-bottom-right round-top-left"
                id={'login-form-account-ri-button'}
            >
                Enter
            </button>

        </div>
    )

    EnterSecretPhraseFormFooter = () => (
        <div className="btn-box align-buttons-inside absolute right-conner wide">
            <a
                className="btn btn-left round round-bottom-left round-top-right"
                onClick={() => this.props.setBodyModalParamsAction('CREATE_USER')}
            >
                Create account
            </a>
            <button
                type="submit"
                name={'closeModal'}
                className="btn btn-right blue round round-bottom-right round-top-left"
                id={'login-form-secret-phrase-button'}
            >
                Enter
            </button>
        </div>
    )


    render() {

        const copyrights = (isMedia) => 
            <p
                className={'hide-xs copyrights'}
                style={{
                    position: "absolute",
                    bottom: '30px',
                    color: 'white',
                    width: '100%',
                    zIndex: 1,
                    textAlign: 'center',
                    left: '0'
                }}
            >
                Copyright © 2017-2018 Apollo Foundation. 
                <br className={'show-media'}/>
                Apollo Version: {!!this.props.appState && this.props.appState.version} <br/>
            </p>

        return (
            <div className="page-content">
                <div className="page-body container-fluid">
                    <div className="login">
                        <ModalBody
                            modalTitle={'Welcome to Apollo'}
                            closeModal={this.props.closeModal}
                            className={'modal-form'}
                        >
                            <TabulationBody
                                className={'p-0'}
                            >
                                <TabContaier sectionName={'Login with Account ID'}>
                                    <ModalBody
                                        closeModal={this.props.closeModal}
                                        handleFormSubmit={(values) => this.enterAccount(values)}
                                        className={'p-0 transparent gray-form'}
                                        isDisabe2FA
                                        isPour
                                        idGroup={'login-page-enter-account-id-'}
                                        isDisableSecretPhrase
                                        CustomFooter={() => this.EnterAccountIDCustomFooter()}
                                    >
                                        <AccountRSFormInput 
                                            id={'login-form-account-ri-field'}
                                            value={''}
                                            field={'accountRS'}
                                            placeholder={'Account ID'}
                                            label={'Account ID'}
                                        />
                                    </ModalBody>
                                </TabContaier>
                                <TabContaier sectionName={'Login with Secret Phrase'}>
                                    <ModalBody
                                        closeModal={this.props.closeModal}
                                        handleFormSubmit={(values) => this.enterAccountByPassphrase(values)}
                                        className={'p-0 transparent gray-form'}
                                        isDisabe2FA
                                        isPour
                                        idGroup={'login-page-enter-secret-phrase-'}
                                        isDisableSecretPhrase
                                        CustomFooter={() => this.EnterSecretPhraseFormFooter()}
                                    >
                                        <InfoBox info>
                                            This option works only for standard wallets.
                                        </InfoBox>
                                        <TextualInputComponent
                                            label={'Secret Phrase'}
                                            placeholder={'Secret Phrase'}
                                            className="mb-3" 
                                            field="secretPhrase"
                                            type={'password'}
                                            id={'login-form-secret-phrase-field'}
                                        />
                                    </ModalBody>
                                </TabContaier>
                            </TabulationBody>
                        </ModalBody>    
                        {copyrights()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state =>  ({
    account: state.account,
    appState: state.account.blockchainStatus
});

const mapDipatchToProps = dispatch => {
    return {
        getAccountAction: (requestParams) => dispatch(getAccountDataAction(requestParams)),
        getAccountDataBySecretPhrasseAction: (requestParams) => dispatch(getAccountDataBySecretPhrasseAction(requestParams)),
        setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
        getConstantsAction: () => dispatch(getConstantsAction()),
    };
};

export default connect(
    mapStateToProps,
    mapDipatchToProps
)(Login);