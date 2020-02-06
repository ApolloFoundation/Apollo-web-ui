import React from 'react';
import {connect} from 'react-redux';
import {searchAliases} from '../../../actions/aliases';
import {setBodyModalParamsAction, setTransactionAlias} from '../../../modules/modals';

import {CheckboxFormInput} from '../../components/form-components/check-button-input';
import CustomInputForm from '../../components/form-components/textual-input';
import CustomTextArea from '../../components/form-components/text-area';
import AutoComplete from '../../components/auto-complete';
import AccountRSFormInput from '../../components/form-components/account-rs'
import NummericInputForm from '../../components/form-components/numeric-input'

const SendMoneyForm = ({values, setValue, modalData, setBodyModalParamsAction, idGroup, searchAliases, onChangeAlias, transactionAlias, setTransactionAlias}) => {
    return(
    <>
        <AccountRSFormInput
            field={'recipient'}
            defaultValue={(modalData && modalData.recipient) ? modalData.recipient : transactionAlias && values.alias ? transactionAlias : ''}
            label={'Recipient'}
            placeholder={'Recipient'}
            setValue={setValue}
            idGroup={idGroup}
            id={`${idGroup}recipient-field`}
        />
        <CheckboxFormInput
            setValue={setValue}
            idGroup={idGroup}
            onChange={() => !values.alias && setTransactionAlias(null)}
            checkboxes={[
                {
                    field: 'alias',
                    label: 'Use alias?'
                }
            ]}
        />
        {values.alias && 
            <AutoComplete
                placeholder={'Alias'}
                label={'Alias'}
                onChange={onChangeAlias}
                loadOptions={(alias) => {
                    return searchAliases({aliasPrefix: alias}).then(({aliases}) => {
                        return aliases.filter(({aliasURI}) => /APL-[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{5}/.test(aliasURI)).map(({aliasName, aliasURI}) => ({
                            value: aliasURI,
                            label: `${aliasName} / ${aliasURI}`,
                        }));
                    });
                }}
            />
        }
        <NummericInputForm
            field={'amountATM'}
            counterLabel={'APL'}
            type={'tel'}
            label={'Amount'}
            setValue={setValue}
            placeholder={'Amount'}
            idGroup={idGroup}
        />
        <CustomInputForm
            hendler={() => setBodyModalParamsAction('SEND_APOLLO_PRIVATE', {...values, feeATM: 5})}
            label={'Private transaction'}
            id={'open-private-transaction-from-modal'}
            type={'button'}
            idGroup={idGroup}
        />
        <CheckboxFormInput
            setValue={setValue}
            idGroup={idGroup}
            checkboxes={[
                {
                    field: 'add_message',
                    label: 'Add a message?'
                }
            ]}
        />
        {
            values.add_message &&
            <>
                <CustomTextArea
                    setValue={setValue}
                    label={'Message'}
                    placeholder={'Message'}
                    field="message"
                    idGroup={idGroup}
                />
                <CheckboxFormInput
                    setValue={setValue}
                    idGroup={idGroup}
                    checkboxes={[
                        {
                            field: 'encrypt_message',
                            label: 'Encrypt Message',
                            defaultValue: true
                        }, {
                            field: 'permanent_message',
                            label: 'Message is Never Deleted',
                        }
                    ]}
                />
            </>
        }
    </>
);
}
const mapStateToProps = ({modals}) => ({
    modalData: modals.modalData,
	transactionAlias: modals.alias,
});

const mapDispatchToProps = dispatch => ({
    searchAliases: (requestParams) => dispatch(searchAliases(requestParams)),
    setTransactionAlias: (data) => dispatch(setTransactionAlias(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


export default connect(mapStateToProps, mapDispatchToProps)(SendMoneyForm);