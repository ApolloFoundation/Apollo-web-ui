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

import TextualInput from '../../../components/form-components/textual-input';
import ModalBody from '../../../components/modals/modal-body';

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

class MarketplaceDelete extends React.Component {
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
            deltaQuantity: (values.quantity - this.state.goods.quantity),
            goods: this.state.goods.goods,
            recipient: this.props.account,
            publicKey: publicKey
        };

        const res = await this.props.submitForm( values, 'dgsDelisting');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('The marketplace item has been deleted successfully!', null, 5000);
        }
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
                submitButtonName="Change quantity"
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
                            label="Current quantity:" 
                            text={goods.quantity}
                        />
                    </>
                }
            </ModalBody>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceDelete);
