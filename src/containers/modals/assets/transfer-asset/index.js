/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import ModalBody from '../../../components/modals/modal-body';
import TransferAssetFrom from './form';

class TransferAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
            quantityATU: values.quantityATU * Math.pow(10, values.decimals)
        }

        this.props.processForm(values, 'transferAsset', 'Transfer asset request has been submitted!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Transfer asset request has been submitted!', null, 5000);
        },(res) => {
            if (res.errorCode === 4) {
                NotificationManager.error('Invalid asset order placement quantity.', 'Error', 5000);
            } else {
                NotificationManager.error(res.errorDescription, 'Error', 5000);
            }
        });
    };

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Transfer asset'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Transfer asset'}
                nameModel={this.props.nameModal}
            >
                <TransferAssetFrom />
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
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferAsset);
