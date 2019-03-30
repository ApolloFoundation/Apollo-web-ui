/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import {getDGSPurchaseAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import TextualInput from '../../../components/form-components/textual-input';
import ModalBody from '../../../components/modals/modal-body';
import TextArea from '../../../components/form-components/text-area';
import NumericInput from '../../../components/form-components/numeric-input';

import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    getDGSPurchasesAction: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSPurchaseAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

class MarketplaceDeliver extends React.Component {
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
            purchase: value
        });

        if (productData) {
            this.setState({
                goods: productData
            })
        }
    };

    async handleFormSubmit(values) {
        values = {
            ...values,
            discountATM: values.discountATM * 100000000,
            priceATM: parseInt(this.state.goods.priceATM) / 100000000,
            purchase: this.state.goods.purchase,
            recipient: this.props.account,
            secretPhrase: values.secretPhrase,
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'dgsDelivery');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Goods has been purchased!', null, 5000);
        }
    }

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    };

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
                        <TextArea 
                            label="Data"
                            placeholder="Description"
                            field="goodsToEncrypt"
                        />
                        <NumericInput
                            label="Discount"
                            field="discountATM"
                            placeholder="Discount"
                            defaultValue={1}
                        />
                    </>
                }
            </ModalBody>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceDeliver);
