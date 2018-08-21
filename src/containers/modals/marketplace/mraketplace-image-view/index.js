import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import  {getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';

import { Form, Text } from 'react-form';
import InfoBox from '../../../components/info-box';

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

@connect(mapStateToProps, mapDispatchToProps)
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
                        <div className="form-group">
                            <div className="exit"><i className="zmdi zmdi-close" /></div>
                            <div className="form-title">
                                <p>{this.state.goods.name}</p>
                            </div>
                            <div
                                style={{
                                    height: 400,
                                    backgroundImage: 'url(https://apollowallet.org/apl?requestType=downloadPrunableMessage&transaction=' + this.state.goods.goods + '&retrieve=true)'
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
