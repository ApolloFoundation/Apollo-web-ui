import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {setAccountPassphrase} from '../../../../modules/account';
import {cancelOffer} from "../../../../actions/wallet";
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';
import InfoBox from "../../../components/info-box";

class ConfirmCancelOffer extends React.Component {

    handleFormSubmit = async (values) => {
        let passphrase = values.passphrase;
        if (!passphrase || passphrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const params = {
            orderId: this.props.modalData.orderId,
            feeATM: 100000000,
            sender: this.props.account,
            passphrase
        };
        const offer = await this.props.cancelOffer(params);
        if (offer) {
            this.props.setAccountPassphrase(passphrase);
            this.props.closeModal();
        }
    };

    render() {
        const {currency, pairRate, offerAmount, total} = this.props.modalData;
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Confirm Order Cancellation'}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName={'Cancel my order'}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
                <InfoBox default>
                    If you are sure you want to cancel your order, type your passphrase to confirm.
                </InfoBox>
                <InfoBox attentionLeft>
                <p>
                    Price {currency.toUpperCase()}: <span>{pairRate}</span>
                </p>
                <p>
                    Amount APL: <span>{offerAmount}</span>
                </p>
                <p>
                    Total {currency.toUpperCase()}: <span>{total}</span>
                </p>
                </InfoBox>
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
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    cancelOffer: (params) => dispatch(cancelOffer(params)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCancelOffer);