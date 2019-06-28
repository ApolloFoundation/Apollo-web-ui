import React from 'react';
import InputForm from '../../components/input-form';
import {connect} from 'react-redux';
import BlockHeightInput from '../../components/form-components/block-height-input';
import InfoBox from '../../components/info-box';

const mapStateToProps = state => ({
    is2fa: state.account.is2FA,
    accountControls: state.account.accountControls
});

const ModalFooter = ({setValue, idGroup, accountControls, is2fa, off2FA}) => (
    <>
        <div className="form-group mb-15">
            <label htmlFor={`${idGroup}secretPhrase-field`}>
                Secret phrase
            </label>
            <div>
                <InputForm
                    isPlain
                    className={'form-control'}
                    type="password"
                    field="secretPhrase"
                    placeholder="Secret Phrase"
                    setValue={setValue}
                    id={`${idGroup}secretPhrase-field`}
                />
            </div>
        </div>
        {is2fa && !off2FA && (
            <div className="form-group mb-15">
                <label>
                    2FA code
                </label>
                <div>
                    <InputForm
                        className={'form-control'}
                        type="password"
                        field="code2FA"
                        placeholder="2FA code"
                        setValue={setValue}
                        id={`${idGroup}code2FA-field`}
                    />
                </div>
            </div>
        )}
        {accountControls && (
            <>
                <InfoBox info>
                    Mandatory Approval account control is enabled. Please set Finish Height.
                    Account Control Details
                </InfoBox>
                <BlockHeightInput
                    setValue={setValue}
                    label={'Finish Height'}
                    field={'phasingFinishHeight'}
                    placeholder={'Finish Height'}
                />
            </>
        )}
    </>
);

export default connect(mapStateToProps)(ModalFooter)