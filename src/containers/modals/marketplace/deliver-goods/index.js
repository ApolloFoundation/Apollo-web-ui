import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import {getDGSPurchaseAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import AdvancedSettings from '../../../components/advanced-transaction-settings'
import { Form, Text, TextArea, Checkbox } from 'react-form';
import InfoBox from '../../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import crypto from "../../../../helpers/crypto/crypto";


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    getDGSPurchasesAction: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSPurchaseAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
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

        const res = await this.props.submitForm(null, null, values, 'dgsDelivery');
        if (res.errorCode) {
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
        return (
            <div className="modal-box x-wide">
                <div className="modal-form">
                    <div className="form-group-app devided no-padding-bottom overflow-hidden">
                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                        {

                            this.state.goods &&
                            <React.Fragment>
                                <div className="left-bar">
                                    <div className="top-bar">
                                        <div
                                            style={{
                                                backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + this.state.goods.goods + '&retrieve=true)'
                                            }}
                                            className={classNames({
                                                "marketplace-image": true,
                                                "no-image": !this.state.goods.hasImage
                                            })}
                                        />
                                    </div>
                                    <div className="bottom-bar">
                                        <div className="description">
                                            {this.state.goods.description}
                                        </div>
                                    </div>
                                </div>
                                <div className="right-bar">
                                    <div className="form-title">
                                        <p>{this.state.goods.name}</p>
                                    </div>
                                    <div className="price">
                                        {this.state.goods.priceATM / 100000000} Apollo
                                    </div>
                                    <div className="info-table">
                                        <div className="t-row">
                                            <div className="t-cell"><span>Date:</span></div>
                                            <div className="t-cell">{this.props.formatTimestamp(this.state.goods.timestamp)}</div>
                                        </div>
                                        <div className="t-row">
                                            <div className="t-cell"><span>Seller:</span></div>
                                            <div className="t-cell">{this.state.goods.sellerRS}</div>
                                        </div>
                                        <div className="t-row">
                                            <div className="t-cell"><span>Quantity:</span></div>
                                            <div className="t-cell">{this.state.goods.quantity}</div>
                                        </div>
                                    </div>
                                    <Form
                                        onSubmit={(values) => this.handleFormSubmit(values)}
                                        render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (

                                            <form className="modal-form" onSubmit={submitForm}>
                                                <div className="form-group-app no-padding-left no-padding-top">
                                                    <div className="input-group-app display-block offset-bottom">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label>Data</label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <TextArea
                                                                    field="goodsToEncrypt"
                                                                    placeholder="Currency Name"
                                                                    min={1}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="input-group-app display-block offset-bottom">

                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label>Discount</label>
                                                            </div>
                                                            <div
                                                                className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                <Text
                                                                    type={'number'}
                                                                    field="discountATM"
                                                                    placeholder='Recipient'
                                                                    className={"form-control"}
                                                                />
                                                                <div className="input-group-append">
                                                                        <span
                                                                            className="input-group-text"
                                                                            id="discountATM"
                                                                        >
                                                                            Apollo
                                                                        </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="input-group-app display-block offset-bottom">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label>Fee</label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <Text type="number" field='feeATM' placeholder="Minimum fee" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="input-group-app display-block offset-bottom">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label>Passphrase</label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <Text type="password" field='secretPhrase' placeholder="Passphrase" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <AdvancedSettings
                                                        setValue={setValue}
                                                        getFormState={getFormState}
                                                        values={values}
                                                        advancedState={this.state.advancedState}
                                                    />
                                                </div>
                                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                                    <a
                                                        onClick={() => this.props.closeModal()}
                                                        className="btn round round-top-left"
                                                    >
                                                        Cancel
                                                    </a>
                                                    <button
                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn btn-right blue round round-bottom-right"
                                                    >
                                                        Deliver goods
                                                    </button>

                                                </div>
                                                <div className="btn-box align-buttons-inside absolute left-conner">
                                                    {
                                                        this.state.advancedState &&
                                                        <a
                                                            onClick={this.handleAdvancedState}
                                                            className="btn btn-right round round-top-right absolute"
                                                            style={{left : 'calc(50% - 35px)', right: 'auto'}}
                                                        >
                                                            Basic
                                                        </a>
                                                    }
                                                    {
                                                        !this.state.advancedState &&
                                                        <a
                                                            onClick={this.handleAdvancedState}
                                                            className="btn btn-right round round-top-right absolute"
                                                            style={{left : 'calc(50% - 35px)', right: 'auto'}}
                                                        >
                                                            {this.state.advancedState ? "Basic" : "Advanced"}
                                                        </a>
                                                    }
                                                </div>
                                            </form>
                                        )}
                                    />
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceDeliver);
