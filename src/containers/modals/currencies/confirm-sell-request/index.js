/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';

class SellCurrency extends React.Component {
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

    handleFormSubmit = async (values) => {
        values = {
            ...values,
            ...this.props.modalData,
            rateATM: this.props.modalData.rateATM * (Math.pow(10, 8) / Math.pow(10, this.props.modalData.decimals)),
            units: this.props.modalData.units * (Math.pow(10, this.props.modalData.decimals))
        };

        this.props.processForm(values, 'currencySell', 'The sell order has been submitted!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The sell order has been submitted!', null, 5000);
        })
    };

    render() {
        const {nameModal} = this.props;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Sell Currency'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Sell'}
                nameModel={nameModal}
            >
                {this.props.modalData && (
                    <React.Fragment>
                        <TextualInputComponent
                            label={"Order Description"}
                            text={`Sell ${this.props.modalData.units} ${this.props.modalData.code} currencies at ${this.props.modalData.rateATM / this.props.modalData.units} APL each.`}
                        />
                        <TextualInputComponent
                            label={"Total"}
                            text={`${this.props.modalData.rateATM} APL`}
                        />
                    </React.Fragment>
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


export default connect(mapStateToProps, mapDispatchToProps)(SellCurrency);
