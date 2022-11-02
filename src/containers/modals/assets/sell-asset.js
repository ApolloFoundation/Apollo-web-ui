/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Text} from 'react-form';
import {NotificationManager} from "react-notifications";
import {setBodyModalParamsAction} from '../../../modules/modals';
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';

class SellAsset extends React.Component {
    handleFormSubmit = async(values) => {
        values = {
            ...values,
            asset: this.props.modalData.assetInfo.asset,
            priceOrder: this.props.modalData.priceATM * (this.props.decimals / Math.pow(10, this.props.modalData.assetInfo.decimals)),
            quantityOrder: (this.props.modalData.quantityATU * Math.pow(10, this.props.modalData.assetInfo.decimals))
        };

        this.props.processForm(values, 'placeAskOrder', 'The sell order has been submitted!', () => {
            this.props.modalCallback();
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The sell order has been submitted!', null, 5000);
        })
    };

    render() {
        const {nameModal, modalData, closeModal, ticker} = this.props;

        const name        = modalData && modalData.assetInfo ? modalData.assetInfo.name : '';
        const assetID     = modalData && modalData.assetInfo ? modalData.assetInfo.assetID : '';
        const quantityATU = modalData && modalData.quantityATU;
        const total       = modalData && modalData.total;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Confirm Order (Sell)'}
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
                    text={`Sell ${quantityATU} ${name} assets at ${total / quantityATU} ${ticker} each.`}
                />

                <TextualInputComponent
                    label={'Total'}
                    text={`${total} ${ticker}`}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    decimals: state.account.decimals,
    ticker: state.account.ticker,
    modalCallback: state.modals.modalCallback,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellAsset);
