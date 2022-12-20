import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {logOutAction} from "../../../../actions/login";
import {logout} from "../../../../actions/wallet";
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';
// TODO update
class LogoutExchange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(values) {
        let passphrase = values.passphrase;
        if (!passphrase || passphrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }
        const params = {
            accountid: this.props.account,
            passphrase
        };
        this.props.logout(params).then((res) => {
            if (!res.errorCode) {
                logOutAction('simpleLogOut', this.props.history);
                this.props.closeModal();
            } 
        });
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Logout'}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName={'Confirm'}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
                <p className='text-danger'>Warning:</p>
                <p>Log out terminates the automated exchange. To continue with any exchange operations, logging in is required.</p>
                <br />
                <TextualInputComponent
                    field={'passphrase'}
                    type={'password'}
                    label={'Secret Phrase'}
                    placeholder={'Secret Phrase'}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    logout: (params) => dispatch(logout(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogoutExchange));