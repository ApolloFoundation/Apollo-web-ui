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

import ModalBody from '../../../components/modals/modal-body';
import Form from './form';

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
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                closeModal={this.props.closeModal}
                isAdvanced
                isFee
                isXWide
                marketplace={{
                    priceATM: goods ? goods.priceATM : null,
                    name: goods ? goods.name : null,
                    hasImage: goods ? goods.hasImage : null,
                    image:  `${config.api.serverUrl}requestType=downloadPrunableMessage&transaction=${goods ? goods.goods : null}&retrieve=true`,
                    description: goods ? goods.description : null
                }}
                submitButtonName="Change price"
            >
                <Form goods={this.state.goods}/>
            </ModalBody>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceChangePrice);
