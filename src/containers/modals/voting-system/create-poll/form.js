import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import CustomFormSelect from 'containers/components/form-components/CustomSelect';
import BlockHeightInput from 'containers/components/form-components/BlockHeight/block-height-input1';
import { AssetInput } from 'containers/components/form-components/AssetInput';
import CurrencyInput from 'containers/components/form-components/CurrencyInput';
import TextComponent from 'containers/components/custom-input/CustomInputWithFormik';

const PollForm = ({ idGroup, ticker, votingModelData }) => {
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
            />

            {values.votingModel === 2 && (
                <AssetInput name='holding' id={idGroup} />
            )}

            {values.votingModel === 3 && (
                <CurrencyInput name='holding' id={idGroup} />
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
                                    <TextComponent
                                        key={`${answer}-${index}`}
                                        name={`answers[${index}]`}
                                        className="mb-0"
                                        placeholder='Answer'
                                    >
                                        <div className="input-group-append" onClick={removeAnswer(remove, values.answers, index)}>
                                            <span className="input-group-text">
                                                <i className="zmdi zmdi-minus-circle cursor-pointer"/>
                                            </span>
                                        </div>
                                    </TextComponent>
                                    
                                    // <Field
                                    //     key={`${answer}-${index}`}
                                    //     name={`answers[${index}]`}
                                    //     className="mb-0"
                                    //     placeholder='Answer'
                                    //     icon={
                                    //         <span className="input-group-text">
                                    //             <i className="zmdi zmdi-minus-circle cursor-pointer"/>
                                    //         </span>
                                    //     }
                                    //     onIconClick={removeAnswer(remove, values.answers, index)}
                                    //     component={TextComponentWithIcon}
                                    // />
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
