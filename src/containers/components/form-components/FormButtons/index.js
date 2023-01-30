import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import { BallPulse } from 'containers/components/BallPulse';
import { getIsModalProcessingSelector } from 'selectors';

const FormButtons = ({
    idGroup, 
    submitButtonName, 
    isPending, 
    isDisabled, 
    closeModal,
    isModalProcessing,
    isClosing,
    cancelButtonName,
}) => (
    <div className="btn-box right-conner align-right form-footer">
        {!isClosing &&
            <button
                type={'button'}
                id={`${idGroup}cancel-button`}
                onClick={closeModal}
                className="btn btn-default mr-3"
            >
                {cancelButtonName ?? 'Cancel'}
            </button>}
        {
            submitButtonName &&
            <button
                type="submit"
                name={'closeModal'}
                id={`${idGroup}submit-button`}
                className={classNames({
                    "btn btn-green" : true,
                    "disabled": isDisabled || isModalProcessing || isPending,
                    "loading": isModalProcessing || isPending
                })}
            >
                <div
                    className="button-loader"
                >
                    <BallPulse />
                </div>
                <span className={'button-text'}>
                    {submitButtonName}
                </span> 
                      
            </button>
        }
    </div>
)

const mapStateToProps = state => ({
    isModalProcessing: getIsModalProcessingSelector(state),
})

export default connect(mapStateToProps)(FormButtons);