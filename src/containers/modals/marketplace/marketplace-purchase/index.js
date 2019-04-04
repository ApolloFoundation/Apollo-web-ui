/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import {getDGSPurchaseAction, getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import TextualInput from '../../../components/form-components/textual-input';
import NumericInput from '../../../components/form-components/numeric-input';
import ModalBody from '../../../components/modals/modal-body';

import Form from './form';

import AdvancedSettings from '../../../components/advanced-transaction-settings'
import InputForm from '../../../components/input-form';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import crypto from "../../../../helpers/crypto/crypto";
import ModalFooter from '../../../components/modal-footer'
import FeeCalc from '../../../components/form-components/fee-calc';


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
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

        values = {
            ...values,
            priceATM: parseInt(this.state.goods.priceATM) / 100000000,
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
        const {formatTimestamp} = this.props;
        const {goods} = this.state;

        return (
            <ModalBody
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                closeModal={this.props.closeModal}
                isAdvanced
                isFee
                isWide
                marketplace={{
                    priceATM: goods ? goods.priceATM : null,
                    name: goods ? goods.name : null,
                    hasImage: goods ? goods.hasImage : null,
                    image:  `${config.api.serverUrl}requestType=downloadPrunableMessage&transaction=${goods ? goods.goods : null}&retrieve=true`,
                    description: goods ? goods.description : null
                }}
                submitButtonName="Purchase"
            >
                <Form goods={this.state.goods}/>                
            </ModalBody>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplacePurchase);
