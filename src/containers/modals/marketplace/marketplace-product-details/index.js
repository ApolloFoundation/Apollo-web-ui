/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import {getDGSGoodAction} from "../../../../actions/marketplace";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';
import TextualInput from "../../../components/form-components/textual-input";


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    decimals: state.account.decimals,
    ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
});

class MarketplaceProductDetails extends React.Component {
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

    render() {
        return (
            <div className="modal-box">
                <div className="modal-form">
                    <div className="form-group-app">
                        <button type="button" onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close"/></button>

                        {this.state.goods && (
                            <div className="right-bar">
                                <div className="form-title">
                                    <p>{this.state.goods.name}</p>
                                </div>
                                <div className="form-group mb-15">
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
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Price:
                                    </label>
                                    <div className="price">
                                        {this.state.goods.priceATM / this.props.decimals} {this.props.ticker}
                                    </div>
                                </div>
                                {this.state.goods.description && (
                                    <div className="form-group mb-15">
                                        <label>
                                            Description:
                                        </label>
                                        <div>
                                            {this.state.goods.description}
                                        </div>
                                    </div>
                                )}
                                <TextualInput
                                    label="Date:"
                                    text={this.props.formatTimestamp(this.state.goods.timestamp)}
                                />
                                <TextualInput
                                    label="Seller:"
                                    text={this.state.goods.sellerRS}
                                />
                                <TextualInput
                                    label="Quantity:"
                                    text={this.state.goods.quantity}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceProductDetails);
