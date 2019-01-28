import React from 'react';
import {Form} from 'react-form';

import {connect} from 'react-redux';
import FormFooter from '../form-components/form-footer';
import InputForm from '../input-form';
import ModalFooter from '../modal-footer';



class ModalBody extends React.Component {
    getForm = (form) => {
        this.setState({form}, () => this.loadValues());

        console.log(14123451234)
        console.log(this.props.loadForm)
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

        const {children, handleFormSubmit, modalTitle, isPending, isFee, closeModal, submitButtonName} = this.props;

        return (
            <div className="modal-box">
                <Form
                    getApi={(value) => this.getForm(value)}
                    onSubmit={(values) => handleFormSubmit(values)}
                    render={({
                            submitForm, values, addValue, removeValue, setValue, getFormState
                    }) => (
                        <form className="modal-form modal-send-apollo" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
    
                                <div className="form-title">
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
                            </div>
                        </form>
                    )} 
                /> 
            </div>
        )
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
})

export default connect(mapStateToProps)(ModalBody);