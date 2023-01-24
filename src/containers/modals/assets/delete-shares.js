/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {NotificationManager} from "react-notifications";
import {Form, Text} from 'react-form';
import submitForm from "../../../helpers/forms/forms";

import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';
import NumericInputComponent from '../../components/form-components/numeric-input';
import { numberToLocaleString } from 'helpers/format';

class DeleteShares extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }
    }

    handleFormSubmit = async(values) => {
        values = {
            ...values,
            asset: values.assetID,
            quantityATU: values.quantityATU * Math.pow(10, this.props.modalData.decimals)
        };

        this.props.processForm(values, 'deleteAssetShares', 'Delete asset request has been submitted!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Delete asset request has been submitted!', null, 5000);
        })
    };

    render() {
        const {modalData} = this.props;
        const decimals = modalData ? modalData.decimals : null

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Delete Shares'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Delete'}
                nameModel={this.props.nameModal}
            >
                <Text defaultValue={this.props.modalData.assetName} type="hidden" field={'name'}/>
                <Text defaultValue={this.props.modalData.assetID} type="hidden" field={'asset'}/>

                <TextualInputComponent
                    label={'Asset'}
                    text={`${this.props.modalData.assetName} - ${numberToLocaleString((this.props.modalData.quantityATU), {
                            minimumFractionDigits: decimals,
                            maximumFractionDigits: decimals
                        })
                    } availiable`}
                />

                <NumericInputComponent
                    label={'Quantity'}
                    placeholder={'Quantity'}
                    field={'quantityATU'}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data)  => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteShares);
