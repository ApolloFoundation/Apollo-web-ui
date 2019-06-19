/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../modules/modals';
import {Text} from 'react-form';
import {ONE_APL} from '../../../constants';

import {NotificationManager} from "react-notifications";

import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';

class BuyAsset extends React.Component {
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
            asset: this.props.modalData.assetInfo.asset,
            priceOrder: this.props.modalData.priceATM * (ONE_APL / Math.pow(10, this.props.modalData.assetInfo.decimals)),
            quantityOrder: (this.props.modalData.quantityATU * Math.pow(10, this.props.modalData.assetInfo.decimals))
        };

        this.props.processForm(values, 'placeBidOrder', 'The buy order has been submitted!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The buy order has been submitted!', null, 5000);
        }, (res) => {
            if (res.errorCode === 4) {
                NotificationManager.error('Invalid asset order placement quantity.', 'Error', 5000);
            } else {
                NotificationManager.error('Error', res.errorDescription, 5000);
            }
        });
    };

    render() {
        const {nameModal, modalData, closeModal} = this.props;

        const name        = modalData && modalData.assetInfo ? modalData.assetInfo.name : '';
        const assetID     = modalData && modalData.assetInfo ? modalData.assetInfo.assetID : '';
        const quantityATU = modalData && modalData.quantityATU;
        const total       = modalData && modalData.total;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Confirm Order (Buy)'}
                isAdvanced={true}
                isFee
                closeModal={closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Confirm Order'}
                nameModel={nameModal}
            >
                <Text defaultValue={name} type="hidden" field={'name'}/>
                <Text defaultValue={assetID} type="hidden" field={'asset'}/>
                <Text defaultValue={quantityATU} placeholder={'Quantity'} type="hidden" field={'quantityATU'}/>

                <TextualInputComponent
                    label={'Order Description'}
                    text={`Buy ${quantityATU} ${name} assets at ${total / quantityATU} APL each.`}
                />

                <TextualInputComponent
                    label={'Total'}
                    text={`${total} APL`}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyAsset);
