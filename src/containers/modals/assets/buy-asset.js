/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../modules/modals';
import {Text} from 'react-form';

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
            priceOrder: this.props.modalData.priceATM * (100000000 / Math.pow(10, this.props.modalData.assetInfo.decimals)),
            quantityOrder: (this.props.modalData.quantityATU * Math.pow(10, this.props.modalData.assetInfo.decimals))
        };

        this.props.processForm(values, 'placeBidOrder', 'The buy order has been submitted!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The buy order has been submitted!', null, 5000);
        });
    };

    render() {
        const {nameModal, modalData, closeModal} = this.props;

        const name        = modalData.assetInfo ? modalData.assetInfo.name : '';
        const assetID     = modalData.assetInfo ? modalData.assetInfo.assetID : '';
        const quantityATU = modalData.quantityATU;
        const total       = modalData.total;
        
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
                    text={`Buy ${quantityATU} ${name} assets at ${total / quantityATU} Apollo each.`}
                />

                <TextualInputComponent 
                    label={'Total'}
                    text={`${total} Apollo`}
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
