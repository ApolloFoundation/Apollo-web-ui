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

import Form from './form';
import ModalBody from '../../../components/modals/modal-body';

import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    decimals: state.account.decimals,
    ticker: state.account.ticker,
    account: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    getDGSPurchasesAction: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSPurchaseAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});
// TODO update
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
            discountATM: values.discountATM * this.props.decimals,
            priceATM: parseInt(this.state.goods.priceATM) / this.props.decimals,
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

    render() {

        const {formatTimestamp, decimals, ticker} = this.props;
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
                submitButtonName="Deliver Goods"
            >
                <Form goods={this.state.goods} decimals={decimals} ticker={ticker} />
            </ModalBody>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceDeliver);
