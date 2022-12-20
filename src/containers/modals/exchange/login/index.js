import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../../modules/modals';
import {setAccountPassphrase} from '../../../../modules/account';
import {getWallets} from "../../../../actions/wallet";
import ModalBody             from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';
// TODO update
class LoginToExchange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async handleFormSubmit(values) {
        let passphrase = values.passphrase;
        if (!passphrase || passphrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const params = {
            account: this.props.accountRS,
            passphrase
        };
        const wallets = await this.props.getWallets(params);
        if (wallets) {
            this.props.setAccountPassphrase(passphrase);
            this.props.closeModal();
        }
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Login to Exchange'}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName={'Enter'}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
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
    accountRS: state.account.accountRS,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    getWallets: (params) => dispatch(getWallets(params)),
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),

});

export default connect(mapStateToProps, mapDispatchToProps)(LoginToExchange);
