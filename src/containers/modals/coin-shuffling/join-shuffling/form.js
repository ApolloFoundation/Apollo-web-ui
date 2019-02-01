import React from 'react';
import {connect} from 'react-redux'; 
import store from '../../../../store';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {NotificationManager} from "react-notifications";

import {Text} from 'react-form';
import TextualIput from '../../../components/form-components/textual-input';
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import InfoBox from '../../../components/info-box';
import {generateAccountAction} from '../../../../actions/account'
import {getShufflingAction} from "../../../../actions/shuffling";

class JoinShufflingForm extends React.Component {

    state = {};

    componentDidMount = () => {
        this.getShuffling()
    }

    getShuffling = async () => {
        const shuffling = await this.props.getShufflingAction({
            shuffling: this.props.modalData
        });

        if (shuffling) {
            this.setState({
                shuffling
            });
        }
    };

    setAccount = async (getFormState, setValue) => {
        const {recipientSecretPhrase} = getFormState(); 
        const passphrase = recipientSecretPhrase;

        const generatedAccount = store.dispatch(await this.props.getAccountIdAsyncApl(passphrase));
        setValue('generatedAccount', generatedAccount);
    };

    setRecipientSecretPhrase = (e) => {
        const {getFormState, setValue} = this.props;
        const {values : {recipientSecretPhrase}} = getFormState()


        if (recipientSecretPhrase !== '') {
            this.setAccount(getFormState, setValue)
        } else {
            setValue('generatedAccount', '')
        }
    }

    handleVaultWalletCondition = async (condition) => {
        if (condition) {
            const vaultWallet = await generateAccountAction({});

            if (vaultWallet) {
                this.setState({
                    vaultWallet
                })
            }
        }
    };

    render () {
        const {modalData, getFormState, setValue} = this.props;
        const {shuffling} = this.state;

        const {values : {isVaultWallet}} = getFormState()

        return (
            <>
                {
                    shuffling &&
                    modalData &&  
                    modalData.broadcast &&
                    <TextualIput
                        label={'Shuffling Id'}
                        text={`${shuffling.shuffling} ${modalData.broadcast.transaction}`}
                    />
                }
                {
                    isVaultWallet && 
                    <div className="form-group row form-group-white mb-15">
                        <label className="col-sm-3 col-form-label">
                            Recipient secret phrase
                        </label>
                        <div className="col-sm-9">
                            <Text 
                                className="form-control"
                                field="recipientSecretPhrase"
                                placeholder="Account ID"
                                onKeyUp={this.setRecipientSecretPhrase}
                                type={'password'}
                            />
                        </div>
                    </div>
                }
                <CheckboxFormInput
                    checkboxes={[
                        {
                            field: 'isVaultWallet',
                            label: 'Use Vault Wallet for Shuffling'
                        }
                    ]}
                />
                <div className="mobile-class row mb-15 form-group-white">
                    <div className="col-md-9 offset-md-3 pl-0">
                        {
                            getFormState().values.isVaultWallet &&
                            this.state.vaultWallet &&
                            <InfoBox attentionLeft>
                                Secret Phrase:  <span className={'itatic'}>{this.state.vaultWallet.passphrase}</span>
                                <br/>
                                <br/>
                                Account ID: <span className={'itatic'}>{this.state.vaultWallet.accountRS}</span>
                                <br/>
                                <br/>
                                Public Key: <span className={'itatic'}>{this.state.vaultWallet.publicKey}</span>
                                <br/>
                                <br/>
                                <CopyToClipboard
                                    text={
                                        `Secret Phrase: ${this.state.vaultWallet.passphrase}\n` +
                                        `Account ID: ${this.state.vaultWallet.accountRS}\n` +
                                        `Public Key: ${this.state.vaultWallet.publicKey}\n`
                                    }
                                    onCopy={() => {
                                        NotificationManager.success('The account data has been copied to clipboard.')
                                    }}
                                >
                                    <a
                                        className="btn blue static"
                                    >
                                        Copy account data to clipboard.
                                    </a>
                                </CopyToClipboard>
                            </InfoBox>
                        }
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    modalBody: state.modals.modalData
})

const mapDispatchToPrps = dispatch => ({
    getShufflingAction: (vlaues) => dispatch(getShufflingAction(vlaues)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
})

export default connect(mapStateToProps, mapDispatchToPrps)(JoinShufflingForm)