import React from 'react';
import { Field } from 'formik';
import InfoBox from 'containers/components/info-box';
import TextualInputForm from 'containers/components/form-components/TextualInput';
import CheckboxFormInput from 'containers/components/check-button-input/CheckboxWithFormik';
import ContentLoader from 'containers/components/content-loader';
import { RangeInput } from 'containers/components/form-components/RangeInput';

const CastVoteForm = ({ currencyHint, assetHint, poll, votes }) => (
    <>
        {
            poll ?
            <>
                {
                    (currencyHint || assetHint) &&
                    <InfoBox info>
                        {currencyHint || assetHint}
                    </InfoBox>
                }
                

                <TextualInputForm
                    label={'Poll name'}
                    text={poll.name}
                />

                <TextualInputForm
                    label={'Description'}
                    text={poll.description}
                />

                {
                    poll && 
                    votes &&
                    poll.maxRangeValue > 1 &&
                    <div className="mb-15">
                        <label>Select option</label>
                        <div className="form-check custom-checkbox mb-15 pl-0">
                            {Object.keys(votes).map((el) =>
                                <Field
                                    key={el}
                                    name={el}
                                    label={votes[el]}
                                    min={poll.minRangeValue}
                                    max={poll.maxRangeValue}
                                    component={RangeInput}
                                    defaultValue={0}
                                />
                            )}
                        </div>
                    </div>
                    
                }
                {
                    poll && 
                    votes &&
                    poll.maxRangeValue === 1 &&
                    <>  
                        <label>Select option</label>
                    
                        {
                            Object.keys(votes).map((el, index) =>(
                                <CheckboxFormInput
                                    key={votes[el]}
                                    name={index > 9 ? 'vote' + index : 'vote0' + index}
                                    label={votes[el]}
                                    id={votes[el]}
                                    defaultValue={false}
                                />
                            ))
                        }
                    </>
                }
            </> 
            :
            <ContentLoader />
        }
    </>
);

export default CastVoteForm;