import React from 'react';
import {connect} from 'react-redux';
import {Text} from "react-form";
import {CheckboxFormInput} from '../../components/form-components/check-button-input';
import AccountRSFormInput from '../../components/form-components/account-rs'
import NummericInputForm from '../../components/form-components/numeric-input'
import InfoBox from "../../components/info-box";
import FeeInputForm from "../../components/form-components/fee-input";

const SendPrivateMoneyForm = ({values, setValue, modalData, idGroup, useMixer, mixerData, handleUseMixer}) => (
    <>
        <AccountRSFormInput
            field={'recipient'}
            defaultValue={(modalData && modalData.recipient) ? modalData.recipient : ''}
            label={'Recipient'}
            placeholder={'Recipient'}
            setValue={setValue}
            idGroup={idGroup}
            id={`${idGroup}recipient-field`}
        />
        {
            useMixer &&
            <React.Fragment>
                <Text
                    type="hidden"
                    field="mixerAccount"
                    defaultValue={mixerData && mixerData.rsId}
                />
                <Text
                    type="hidden"
                    field="mixerPublicKey"
                    defaultValue={mixerData && mixerData.publicKey}
                />
            </React.Fragment>
        }
        {
            useMixer &&
            <InfoBox info>
                Your money will be sent directly to mixer account and during estimated mixing
                time, money will be transferred to recipient's account.
            </InfoBox>
        }
        <NummericInputForm
            field={'amountATM'}
            counterLabel={'APL'}
            type={'tel'}
            label={'Amount'}
            setValue={setValue}
            placeholder={'Amount'}
            idGroup={idGroup}
            defaultValue={(modalData && modalData.amountATM) ? modalData.amountATM : ''}
        />
        {mixerData && (
            <CheckboxFormInput
                checkboxes={[
                    {
                        field: 'isMixer',
                        label: 'Use Mixer',
                        defaultValue: useMixer,
                        handler: handleUseMixer,
                    }
                ]}
            />
        )}
        {useMixer && (
            <NummericInputForm
                field="duration"
                counterLabel={'Minutes'}
                type={"float"}
                label={'Mixing time'}
                setValue={setValue}
                placeholder="Duration"
                idGroup={idGroup}
                defaultValue={(modalData && modalData.duration) ? modalData.duration : ''}
            />
        )}
        <FeeInputForm
            field={'feeATM'}
            values={values}
            setValue={setValue}
            idGroup={idGroup}
            defaultValue={(modalData && modalData.feeATM) || '5'}
        />
    </>
);

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});


export default connect(mapStateToProps)(SendPrivateMoneyForm);