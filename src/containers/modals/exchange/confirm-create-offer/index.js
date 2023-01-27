import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {setAccountPassphrase} from 'modules/account';
import {createOffer} from "actions/wallet";
import ModalBody from 'containers/components/modals/modal-body';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import {
    getAccountPublicKeySelector, getAccountRsSelector, getModalDataSelector
} from 'selectors';

class ConfirmCreateOffer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPending: false,
            passphraseStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async handleFormSubmit(values) {
        if(!this.state.isPending) {
            this.setState({isPending: true});
            let passphrase = values.passphrase;
            if (!passphrase || passphrase.length === 0) {
                NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
                this.setState({isPending: false});
                return;
            }

            const params = {
                ...this.props.modalData.params,
                passphrase,
            };
            const offer = await this.props.createOffer(params);
            if (offer) {
                this.props.modalData.resetForm();
                this.props.setAccountPassphrase(passphrase);
                this.props.closeModal();
            }
            this.setState({isPending: false});
        }
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Confirm order'}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName={'Enter'}
                isPending={this.state.isPending}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
                <TextualInputComponent
                    name='passphrase'
                    type='password'
                    label='Secret Phrase'
                    placeholder='Secret Phrase'
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: getModalDataSelector(state),
    accountRS: getAccountRsSelector(state),
    publicKey: getAccountPublicKeySelector(state)
});

const mapDispatchToProps = {
    createOffer,
    setAccountPassphrase,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCreateOffer);