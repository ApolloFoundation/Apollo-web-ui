/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import  {getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import NummericInput from '../../../components/form-components/numeric-input';
import ModalBody from '../../../components/modals/modal-body';
import TextualInput from '../../../components/form-components/textual-input';

import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import crypto from "../../../../helpers/crypto/crypto";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

class MarketplaceChangePrice extends React.Component {
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
        const productData = await this.props.getDGSGoodAction({
            goods: value
        });

        if (productData) {
            this.setState({
                goods: productData
            })
        }
    };

    async handleFormSubmit(values) {
        const publicKey = await crypto.getPublicKeyAPL(values.secretPhrase, false);

        values = {
            ...values,
            priceATM: parseInt(values.priceATM),
            goods: this.state.goods.goods,
            recipient: this.props.account,
            publicKey: publicKey
        };

        this.props.processForm(values, 'dgsPriceChange', 'The marketplace item\'s price has been changed successfully!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The marketplace item\'s price has been changed successfully!', null, 5000);
        })
    }

    render() {

        const {formatTimestamp} = this.props;
        const {goods} = this.state;

        return (
            <ModalBody
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
                modalTitle={`${goods ? goods.priceATM / 100000000 : null} Apollo`}
                submitButtonName="Change price"
            >
                {
                    goods &&  
                    <>
                        <TextualInput
                            label="Date:" 
                            text={formatTimestamp(goods.timestamp)}
                        />
                        <TextualInput
                            label="Seller:" 
                            text={goods.sellerRS}
                        />
                        <TextualInput
                            label="Quantity:" 
                            text={goods.quantity}
                        />
                        <TextualInput
                            label="Current price:" 
                            text={`${(this.state.goods.priceATM / 100000000).toLocaleString('en')} APL`}
                        />
                        <NummericInput
                            label="Quantity:"
                            field="priceATM"
                            placeholder="Quantity"
                            defaultValue={1}
                        />
                    </>
                }
            </ModalBody>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceChangePrice);
