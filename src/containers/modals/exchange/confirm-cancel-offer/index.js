import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {setAccountPassphrase} from '../../../../modules/account';
import {cancelOffer} from "../../../../actions/wallet";
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';
import InfoBox from "../../../components/info-box";
// TODO update
class ConfirmCancelOffer extends React.Component {

    state = {
        isPending: false,
    }

    handleFormSubmit = async (values) => {
        if(!this.state.isPending) {
            this.setState({isPending: true});
            let passphrase = values.passphrase;
            if (!passphrase || passphrase.length === 0) {
                NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
                this.setState({isPending: false});
                return;
            }

            const params = {
                orderId: this.props.modalData.orderId,
                feeATM: this.props.decimals,
                sender: this.props.account,
                passphrase,
            };
            const offer = await this.props.cancelOffer(params);
            if (offer) {
                this.props.setAccountPassphrase(passphrase);
                this.props.closeModal();
            }
            this.setState({isPending: false});
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
                isPending={this.state.isPending}
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
                    Amount {this.props.ticker}: <span>{offerAmount}</span>
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
    ticker: state.account.ticker,
    decimals: state.account.decimals,
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    cancelOffer: (params) => dispatch(cancelOffer(params)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCancelOffer);
