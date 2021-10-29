import React from 'react';
import {connect} from 'react-redux';
import {Text} from 'react-form';

import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import InfoBox from "../../../components/info-box";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {NotificationManager} from "react-notifications";
import InputForm from "../../../components/input-form";

const JoinShufflingForm = ({values, setValue, getFormState, modalData, setAccount, handleVaultWalletCondition, shuffling, vaultWallet}) => (
    <>
        <div className="form-group mb-15">
            <label>
                Shuffling Id
            </label>
            <div>
                {shuffling &&
                <p>{shuffling.shuffling}</p>
                }
                {modalData && modalData.broadcast &&
                <p>{modalData.broadcast.transaction}</p>
                }
            </div>
        </div>
        {
            !values.isVaultWallet &&
            <div className="form-group mb-15">
                <label>
                    Recipient secret phrase
                </label>
                <div>
                    <Text className="form-control"
                          field="recipientSecretPhrase"
                          placeholder="Recipient Secret Phrase"
                          onKeyUp={(e) => {
                              if (values.recipientSecretPhrase !== '') {
                                  setAccount(getFormState, setValue)
                              } else {
                                  setValue('generatedAccount', '')
                              }
                          }}
                          type={'password'}/>
                </div>
            </div>
        }
        <CheckboxFormInput
            setValue={setValue}
            checkboxes={[
                {
                    field: 'isVaultWallet',
                    label: 'Use Vault Wallet for Shuffling',
                    handler: handleVaultWalletCondition,
                    defaultValue: false
                }
            ]}
        />
        <div className="mobile-class mb-15 ">
            {
                values.isVaultWallet &&
                vaultWallet &&
                <InfoBox attentionLeft>
                    <p className={'mb-3'}>
                        Account ID: <span className={'itatic'}>{vaultWallet.accountRS}</span>
                    </p>
                    <p className={'mb-3'}>
                        Secret Phrase:  <span className={'itatic'}>{vaultWallet.passphrase}</span>
                    </p>
                    <p className={'mb-3'}>
                        Public Key: <span className={'itatic'}>{vaultWallet.publicKey}</span>
                    </p>
                    <CopyToClipboard
                        text={
                            `Account ID: ${vaultWallet.accountRS}\n` +
                            `Secret Phrase: ${vaultWallet.passphrase}\n` +
                            `Public Key: ${vaultWallet.publicKey}\n`
                        }
                        onCopy={() => {
                            NotificationManager.success('The account data has been copied to clipboard.')
                        }}
                    >
                        <button
                            type={'button'}
                            className="btn btn-green"
                        >
                            Copy account data to clipboard.
                        </button>
                    </CopyToClipboard>
                </InfoBox>
            }
        </div>

        {
            !values.isVaultWallet &&
            <div className="form-group mb-15">
                <label>
                    Recipient Account
                </label>
                <div>
                    <InputForm
                        disabled={true}
                        field="generatedAccount"
                        placeholder="Account ID"
                        setValue={setValue}/>
                </div>
            </div>
        }
    </>
);

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

export default connect(mapStateToProps)(JoinShufflingForm);