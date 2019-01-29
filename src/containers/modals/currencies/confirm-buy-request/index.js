/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import AdvancedSettings from '../../../components/advanced-transaction-settings';
import InputForm from '../../../components/input-form';
import {Form, Text} from 'react-form';

import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import ModalFooter from '../../../components/modal-footer';
import FeeCalc from '../../../components/form-components/fee-calc';

import BackForm from '../../modal-form/modal-form-container';

import ModalBody from '../../../components/modals/modal-body';
import BlockHeightInput from '../../../components/form-components/block-height-input';
import NumericInput from '../../../components/form-components/numeric-input';
import TextualInputComponent from '../../../components/form-components/textual-input';



class BuyCurrency extends React.Component {
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
            ...this.props.modalData,
            rateATM: this.props.modalData.rateATM  * (Math.pow(10, 8) / Math.pow(10, this.props.modalData.decimals)),
            units: this.props.modalData.units * (Math.pow(10, this.props.modalData.decimals))
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'currencyBuy');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The buy order has been submitted!', null, 5000);
        }
    };

    render() {
        const {nameModal} = this.props;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Buy Currency'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Buy'}
                nameModel={nameModal}
            >
                <Text defaultValue={this.props.modalData.assetName} type="hidden" field={'name'}/>
                <Text defaultValue={this.props.modalData.assetID} type="hidden" field={'asset'}/>
                <Text defaultValue={this.props.modalData.quantityATU} placeholder={'Quantity'} type="hidden" field={'quantityATU'}/>
                
                <Text defaultValue={this.props.modalData.assetName} placeholder={'Quantity'} type="hidden" field={'quantityATU'}/>
                
                <TextualInputComponent
                    label={"Order Description"}
                    text={`Buy ${this.props.modalData.units} ${this.props.modalData.assetName} currencies at ${this.props.modalData.rateATM / this.props.modalData.units} Apollo each.`}
                />
                <TextualInputComponent
                    label={"Total"}
                    text={`${this.props.modalData.rateATM} Apollo`}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyCurrency);
