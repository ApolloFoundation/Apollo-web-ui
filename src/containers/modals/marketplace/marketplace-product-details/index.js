import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import  {getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import { Form, Text } from 'react-form';
import InfoBox from '../../../components/info-box';

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
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
            <div className="modal-box x-wide">
                <div className="modal-form">
                    <div className="form-group-app devided">
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
                            </div>
                        ]
                    }
                    </div>
                </div>
            </div>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceProductDetails);
