import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

const FormFooter = ({
    idGroup, 
    submitButtonName, 
    isAdvanced, 
    isPending, 
    isDisabled, 
    setValue, 
    closeModal,
    isMomalProcessing
}) => (
    <div className="btn-box right-conner align-right form-footer">
        <button
            type={'button'}
            id={`${idGroup}cancel-button`}
            onClick={closeModal}
            className="btn btn-default mr-3"
        >
            Cancel
        </button>
        {
            submitButtonName &&
            <button
                type="submit"
                name={'closeModal'}
                id={`${idGroup}submit-button`}
                className={classNames({
                    "btn" : true,
                    "btn-right" : true,
                    "btn-green" : true,
                    "submit-button" : true,
                    "btn-green-disabled": isDisabled,
                    "loading": isMomalProcessing
                })}
            >
                <div
                    className="button-loader"
                >
                    <div className="ball-pulse">
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
                <span className={'button-text'}>
                    {submitButtonName}
                </span> 
                      
            </button>
        }
    </div>
)

const mapStateToProps = state => ({
    isMomalProcessing: state.modals.isMomalProcessing,
})

export default connect(mapStateToProps)(FormFooter);