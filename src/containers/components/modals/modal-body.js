import React from 'react';
import {Form} from 'react-form';

import {connect} from 'react-redux';
import FormFooter from '../form-components/form-footer';
import InputForm from '../input-form';
import ModalFooter from '../modal-footer';

import AdvancedSettings from '../advanced-transaction-settings';
import {setBodyModalParamsAction, saveSendModalState, openPrevModal} from "../../../modules/modals";

import BackForm from '../../../containers/modals/modal-form/modal-form-container';


class ModalBody extends React.Component {
    getForm = (form) => {
        this.setState({form}, () => this.loadValues());

        if (this.props.loadForm) {
            this.props.loadForm(form)
        }
    };
    
	loadValues = (values) => {
		if (values) {
			this.state.form.setAllValues(values);
			return;
        }
	};

    render () {

        const {isAdvanced, openPrevModal, modalsHistory, saveSendModalState, nameModel, children, handleFormSubmit, modalTitle, isPending, isFee, closeModal, submitButtonName} = this.props;

        return (
            <div className="modal-box">
                <BackForm
                    getApi={(value) => this.getForm(value)}
                    onSubmit={(values) => handleFormSubmit(values)}
                    nameModel={nameModel}
                    render={({
                            submitForm, values, addValue, removeValue, setValue, getFormState
                    }) => (
                        <form
                            onChange={() => saveSendModalState(values)}
                            onSubmit={submitForm} 
                            className="modal-form modal-send-apollo" 
                        >
                            <div className="form-group-app">
                                <a onClick={closeModal} className="exit"><i className="zmdi zmdi-close" /></a>
    
                                <div className="form-title">
                                    {
                                        modalsHistory.length > 1 &&
	                                    <div className={"backMy"} onClick={() => {openPrevModal()}}></div>
                                    }
                                    <p>{modalTitle}</p>
                                </div>
    
                                {/** Passing props to each form component */}
                                {
                                    React.Children.map(children, child => {
                                            if (child) {
                                                return React.cloneElement(child, {...submitForm, values, addValue, removeValue, setValue, getFormState})
                                            }
                                        }
                                    )
                                }
                                
                                {/** Rendering of fee calculation */}
                                {
                                    isFee &&
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee   
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                            <InputForm
                                                field="feeAPL"
                                                placeholder="Amount"
                                                type={"float"}
                                                setValue={setValue}
                                                defaultValue={''}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text">Apollo</span>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/** Rendering of secret phrase and 2fa fields */}
                                {
                                    handleFormSubmit &&
                                    <ModalFooter 
                                        setValue={setValue}      
                                        getFormState={getFormState}
                                        values={values}                      
                                    />
                                }
                            
                                {/** Bottom forms buttons */}
                                <FormFooter 
                                    submitButtonName={submitButtonName}
                                    isPending={isPending}
                                    setValue={setValue}
                                    closeModal={closeModal}
                                />

                                {
                                    isAdvanced && 
                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                    />
                                }
                            </div>
                        </form>
                    )} 
                /> 
            </div>
        )
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory
})

const mapDispatchToProps = dispatch => ({
    saveSendModalState: (params) => dispatch(saveSendModalState(params)),
	openPrevModal: () => dispatch(openPrevModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalBody);