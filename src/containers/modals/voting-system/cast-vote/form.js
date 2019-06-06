import React from 'react';
import InfoBox from '../../../components/info-box';
import TextualInputForm from '../../../components/form-components/textual-input';
import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import CustomRange from '../range';
import ContentLoader from '../../../components/content-loader';

const CastVoteForm = ({currencyHint, assetHint, poll, votes, getFormState, setValue}) => (
    <>
        {
            poll && 
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
                    <div className="row form-group-grey">
                        <div className={`col-md-3 pl-0`}>
                            <span>Select option</span>
                        </div>
                        
                        <div className={`col-md-9 offset-md-3`}>
                            <div className="form-check custom-checkbox mb-15">
                                {Object.keys(votes).map((el) =>
                                    <CustomRange 
                                        setValue={setValue}
                                        label={votes[el]}
                                        min={poll.minRangeValue}
                                        max={poll.maxRangeValue}
                                        el={el}
                                        getFormState={getFormState}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    
                }
                {
                    poll && 
                    votes &&
                    poll.maxRangeValue === 1 &&
                    
                    <CheckboxFormInput 
                        label={'Select option'}
                        checkboxes={Object.keys(votes).map((el, index) => {
                            if (index > 9) {
                                return ({
                                    field : 'vote' + index,
                                    handler : null,
                                    label : votes[el]
                                });
                            } else {
                                return ({
                                    field : 'vote0' + index,
                                    handler : null,
                                    label : votes[el]
                                });
                            }
                        })}
                    />
                }
            </> ||
            <ContentLoader />
        }
        
    </>
)

export default CastVoteForm;