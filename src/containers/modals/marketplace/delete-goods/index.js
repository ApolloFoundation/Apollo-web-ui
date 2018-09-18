import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import  {getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import AdvancedSettings from '../../../components/advanced-transaction-settings'
import { Form, Text, Checkbox } from 'react-form';
import InfoBox from '../../../components/info-box';
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
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
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
        const publicKey = await crypto.getPublicKey(values.secretPhrase, false);

        values = {
            ...values,
            deltaQuantity: (values.quantity - this.state.goods.quantity),
            goods: this.state.goods.goods,
            recipient: this.props.account,
            publicKey: publicKey
        };

        const res = await this.props.submitForm(null, null, values, 'dgsDelisting');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('The marketplace item has been deleted successfully!', null, 5000);
        }
    }

    render() {
        return (
            <div className="modal-box x-wide">
                <div className="modal-form">
                    <div className="form-group-app devided no-padding-bottom overflow-hidden">
                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
                        {
                            this.state.goods &&

                            [
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
                                </div>,
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
                                                        Delete
                                                    </button>

                                                </div>
                                                <div className="btn-box align-buttons-inside absolute left-conner">
                                                    <a
                                                        onClick={this.handleAdvancedState}
                                                        className="btn btn-right round round-top-right absolute"
                                                        style={{left : 'calc(50% - 35px)', right: 'auto'}}
                                                    >
                                                        {this.state.advancedState ? "Basic" : "Advanced"}
                                                    </a>
                                                </div>
                                            </form>
                                        )}
                                    />
                                </div>
                            ]
                        }
                    </div>
                </div>
            </div>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceDelete);
