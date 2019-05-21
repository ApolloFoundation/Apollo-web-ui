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

class HashCalculation extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
            generatedHash: false,
        };
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    async handleFormSubmit(values) {
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
    }

    handleAdvancedState() {
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
    }

    hashOptions = [
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
                            label: 'Textual data representation'
                        }
                    ]}
                />
                <CustomFormSelect
                    options={this.hashOptions}
                    label={'Hash algorithm'}
                    field={'alg'}
                />
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
