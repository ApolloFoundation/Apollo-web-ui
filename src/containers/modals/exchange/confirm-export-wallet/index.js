import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../../modules/modals';
import {setAccountPassphrase} from '../../../../modules/account';
import {exportWallet} from "../../../../actions/wallet";
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';

class ConfirmExportWallet extends React.Component {
    state = {
        isPending: false,
    };

    handleFormSubmit = async (values) => {
        if(!this.state.isPending) {
            this.setState({isPending: true});
            let passphrase;
            if (this.props.passPhrase) {
                passphrase = this.props.passPhrase;
            } else {
                passphrase = values.passphrase;
                if (!passphrase || passphrase.length === 0) {
                    NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
                    this.setState({isPending: false});
                    return;
                }
            }
    
            const params = {
                ...this.props.modalData.params,
                ...values,
                passphrase,
                account: this.props.account,
            };
            const wallet = await this.props.exportWallet(params);
            if (wallet) {
                this.props.modalData.resetForm();
                this.props.setAccountPassphrase(passphrase);
                this.props.closeModal();
            }
            this.setState({isPending: false});
        }
    };

    render() {
        const {passPhrase, is2FA} = this.props;
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Export ETH wallet'}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName={'Export'}
                isPending={this.state.isPending}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
                {!passPhrase && (
                    <TextualInputComponent
                        field={'passphrase'}
                        type={'password'}
                        label={'Secret Phrase'}
                        placeholder={'Secret Phrase'}
                    />
                )}

                {is2FA && (
                    <TextualInputComponent
                        field={'code2FA'}
                        type={'password'}
                        label={'2FA code'}
                        placeholder={'2FA code'}
                    />
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = ({account, modals}) => ({
    modalData: modals.modalData,
    account: account.account,
    passPhrase: account.passPhrase,
    is2FA: account.is2FA,
});

const mapDispatchToProps = dispatch => ({
    exportWallet: (params) => dispatch(exportWallet(params)),
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmExportWallet);