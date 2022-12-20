import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../../modules/modals';
import {setAccountPassphrase} from '../../../../modules/account';
import {createOffer} from "../../../../actions/wallet";
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';
// TODO update
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
    modalData: state.modals.modalData,
    accountRS: state.account.accountRS,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    createOffer: (params) => dispatch(createOffer(params)),
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCreateOffer);