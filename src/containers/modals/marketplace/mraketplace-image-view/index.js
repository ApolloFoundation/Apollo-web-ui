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
import config from '../../../../config'

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class MarketplaceImage extends React.Component {
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
            <div className="modal-box wide">
                <div className="modal-form">
                    {
                        this.state.goods &&
                        <div className="form-group-app">
                            <button onClick={() => this.props.closeModal()} type="button" className="exit"><i className="zmdi zmdi-close" /></button>
                            <div className="form-title">
                                <p>{this.state.goods.name}</p>
                            </div>
                            <div
                                style={{
                                    height: 400,
                                    backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + this.state.goods.goods + '&retrieve=true)'
                                }}
                                className={classNames({
                                    "marketplace-image": true,
                                    "no-image": !this.state.goods.hasImage
                                })}
                            />
                        </div>
                    }
                </div>
            </div>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceImage);
