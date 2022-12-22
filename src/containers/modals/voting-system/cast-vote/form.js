import React from 'react';
import { Field } from 'formik';
import InfoBox from '../../../components/info-box';
import TextualInputForm from '../../../components/form-components/textual-input/textual-input1';
import CheckboxFormInput from '../../../components/check-button-input';
import ContentLoader from '../../../components/content-loader';
import { RangeInput } from '../../../components/form-components-new/RangeInput';

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