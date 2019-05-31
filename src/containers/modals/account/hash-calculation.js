/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";
import CustomTextArea from "../../components/form-components/text-area";
import {CheckboxFormInput} from "../../components/form-components/check-button-input";
import CustomFormSelect from "../../components/form-components/custom-form-select";
import ModalBody from "../../components/modals/modal-body";

const hashOptions = [
    {
        label: "SHA256",
        value: "2"
    },
    {
        label: "SHA3",
        value: "3",
    },
    {
        label: "SCRYPT",
        value: "5",
    },
    {
        label: "RIPEMD160",
        value: "6"
    },
    {
        label: "Keccak25",
        value: "25"
    },
    {
        label: "RIPEMD160_SHA256",
        value: "62"
    }
];

class HashCalculation extends React.Component {
    state = {
        activeTab: 0,
        advancedState: false,

        // submitting
        passphraseStatus: false,
        recipientStatus: false,
        amountStatus: false,
        feeStatus: false,
        generatedHash: false,
    };

    handleFormSubmit = async (values) => {
        values = {
            secret: values.data,
            secretIsText: values.isMessage,
            hashAlgorithm: values.alg,
            feeATM: 0
        };

        this.props.processForm(values, 'hash', null, (res) => {
            this.setState({
                generatedHash: res.hash
            });
        });
    };

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    };

    render() {
        return (
            <ModalBody
                modalTitle={'Hash calculation'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Calculate'}
                isDisableSecretPhrase
            >
                <CustomTextArea
                    label={'Data'}
                    placeholder={'Data to hash'}
                    field={'data'}
                />
                <CheckboxFormInput
                    checkboxes={[
                        {
                            field: 'isMessage',
                            label: 'Textual data representation',
                            defaultValue: true
                        }
                    ]}
                />
                {hashOptions && (
                    <CustomFormSelect
                        options={hashOptions}
                        defaultValue={hashOptions[0]}
                        label={'Hash algorithm'}
                        field={'alg'}
                    />
                )}
                {this.state.generatedHash && (
                    <div className='info-box blue-info'>
                        <div className="token word-brake">{this.state.generatedHash}</div>
                    </div>
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),

});

export default connect(mapStateToProps, mapDispatchToProps)(HashCalculation);
