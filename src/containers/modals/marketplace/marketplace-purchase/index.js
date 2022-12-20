/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import {getDGSPurchaseAction, getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';
import ModalBody from '../../../components/modals/modal-body';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import crypto from "../../../../helpers/crypto/crypto";
import Form from './form';


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS,
    decimals: state.account.decimals,
    ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSPurchaseAction: (requestParams) => dispatch(getDGSPurchaseAction(requestParams)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});
// TODO update
class MarketplacePurchase extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            goods: null
        };

    }

    componentDidMount() {
        this.handleImageLoadint(this.props.modalData)
    }

    handleImageLoadint = async (value) => {
        const productData = await this.props.getDGSPurchaseAction({
            purchase: value
        });

        const productGoods = await this.props.getDGSGoodAction({
            goods: value
        });

        if (productData && !productData.errorCode) {
            this.setState({
                goods: productData
            })
            return;
        }
        if (productGoods && !productGoods.errorCode) {
            this.setState({
                goods: productGoods
            })
            return;
        }
    };

    async handleFormSubmit(values) {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }
        if (!values.quantity || parseInt(values.quantity) === 0) {
            NotificationManager.error('Quantity must be greater than 0.', 'Error', 5000);
            return;
        }

        values = {
            ...values,
            priceATM: parseInt(this.state.goods.priceATM) / this.props.decimals,
            goods: this.state.goods.goods,
            recipient: this.props.account,
            secretPhrase: values.secretPhrase
        };

        this.props.processForm(values, 'dgsPurchase', 'Goods has been purchased', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Goods has been purchased!', null, 5000);
        })
    }

    render() {
        const {goods} = this.state;

        return (
            <ModalBody
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                closeModal={this.props.closeModal}
                isAdvanced
                isFee
                marketplace={{
                    priceATM: goods ? goods.priceATM : null,
                    name: goods ? goods.name : null,
                    hasImage: goods ? goods.hasImage : null,
                    image:  `${config.api.serverUrl}requestType=downloadPrunableMessage&transaction=${goods ? goods.goods : null}&retrieve=true`,
                    description: goods ? goods.description : null
                }}
                submitButtonName="Purchase"
            >
                <Form
                  goods={this.state.goods}
                  ticker={this.props.ticker}
                  decimals={this.props.decimals}
                />
            </ModalBody>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketplacePurchase);
