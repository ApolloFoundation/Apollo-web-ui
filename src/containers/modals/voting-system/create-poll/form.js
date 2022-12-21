import React from 'react';
import { Field, FieldArray, useFormikContext } from 'formik';
import TextualInputComponent from '../../../components/form-components/textual-input/textual-input1';
import CustomTextArea from '../../../components/form-components/text-area1';
import CustomFormSelect from '../../../components/form-components/custom-form-select1';
import BlockHeightInput from '../../../components/form-components/BlockHeight/block-height-input1';
import { AssetInput } from '../../../components/form-components-new/AssetInput';
import { CurrencyInput } from '../../../components/form-components-new/CurrencyInput';
import { TextComponentWithIcon } from '../../../components/form-components-new/TextComponent';

const votingModelData = [
    {value: 0, label: 'Vote by Account'},
    {value: 1, label: 'Vote by Account Balance'},
    {value: 2, label: 'Vote by Asset Balance'},
    {value: 3, label: 'Vote by Currency Balance'}
];

const PollForm = ({ idGroup, ticker }) => {
    const { values } = useFormikContext();
    const removeAnswer = (remove, answers, index) => () => {
        if (answers && answers.length > 1) {
            remove(index);
        }
    };

    const selectedBalanceType = () => {
        const obj = {
            0: '(none)',
            1: `(${ticker})`,
            2: '(Asset)',
            3: '(Currency)',
        }
        return obj[values?.votingModel] ?? null;
    };

    return (
        <>
            <TextualInputComponent
                label='Name'
                name="name"
                placeholder="Poll Name"
                type="text"
                isSpecialSymbols
                idGroup={idGroup}
            />

            <CustomTextArea
                label='Description'
                name='description'
                placeholder='Description'
                idGroup={idGroup}
            />

            <CustomFormSelect
                options={votingModelData}
                label='Poll By'
                name='votingModel'
                idGroup={idGroup}
                defaultValue={votingModelData[0]}
            />

            {values.votingModel === 2 && (
                <Field name='holding' id={idGroup} component={AssetInput} />
            )}

            {values.votingModel === 3 && (
                <Field name='holding' id={idGroup} component={CurrencyInput} />
            )}

            {values.votingModel !== 0 && (
                <TextualInputComponent
                    label={`Min voting balance ${selectedBalanceType()}`}
                    name="minBalance"
                    placeholder=""
                    type="tel"
                />
            )}
            <BlockHeightInput
                label='Finish height'
                name='finishHeight'
                placeholder='Finish height'
                idGroup={idGroup}
            />

            <div className="mb-0">
                <label>
                    Answer
                </label>
                <div>
                    <FieldArray name='answers'>
                        {({ remove, push }) => (
                            <>
                                {values.answers.map((answer, index) =>(
                                    <Field
                                        key={`${answer}-${index}`}
                                        name={`answers[${index}]`}
                                        className="mb-0"
                                        placeholder='Answer'
                                        icon={
                                            <span className="input-group-text">
                                                <i className="zmdi zmdi-minus-circle cursor-pointer"/>
                                            </span>
                                        }
                                        onIconClick={removeAnswer(remove, values.answers, index)}
                                        component={TextComponentWithIcon}
                                    />
                                ))}
                                <div className="mb-15">
                                    <button
                                        type='button'
                                        id={`${idGroup}addAnswer-field`}
                                        className="no-margin btn btn-green"
                                        onClick={() => push("")}
                                    >
                                        Add answer
                                    </button>
                                </div>
                            </>
                        )}
                    </FieldArray>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <TextualInputComponent
                        label='Min number of choices'
                        placeholder=''
                        name='minNumberOfOptions'
                        type='tel'
                        idGroup={idGroup}
                    />
                    <TextualInputComponent
                        label='Max number of choices'
                        placeholder=''
                        name='maxNumberOfOptions'
                        type='tel'
                        idGroup={idGroup}
                    />
                </div>
                <div className="col-sm-6">
                    <TextualInputComponent
                        label='Min range value'
                        placeholder=''
                        name='minRangeValue'
                        type='tel'
                        idGroup={idGroup}
                    />
                    <TextualInputComponent
                        label='Max range value'
                        placeholder=''
                        name='maxRangeValue'
                        type='tel'
                        idGroup={idGroup}
                    />
                </div>
            </div>
        </>
    )
}

export default PollForm;
