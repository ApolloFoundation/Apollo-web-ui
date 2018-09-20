import React from 'react';
import uuid from 'uuid';
import {setBodyModalParamsAction, setMopalType} from "../../../../modules/modals";
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {getAskOrders, getBidOrders} from "../../../../actions/marketplace";

class MyAssetItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transfer: this.props.transfer
        }
        this.getAskOrders();
        this.getBidOrders();
    }

    componentWillReceiveProps (newState) {
        this.setState({
            transfer: newState.transfer
        }, () => {
            this.getAskOrders();
            this.getBidOrders();
        })
    }

    getAskOrders = async () => {
        const askOrders = await this.props.getAskOrders(this.state.transfer.asset);

        if (askOrders) {

            console.log(askOrders);

            let orders = Math.min(...askOrders.orders.map((el) => {
                return el.priceATM
            }));

            orders = isFinite(orders) ? orders : null;

            console.log(orders)

            this.setState({
                lowestAskOrder : orders
            })

        }
    };

    getBidOrders = async () => {
        const bidOrders = await this.props.getBidOrders(this.state.transfer.asset);

        if (bidOrders) {

            if (bidOrders) {

                console.log(bidOrders);

                let orders = Math.max(...bidOrders.orders.map((el) => {
                    return el.priceATM
                }));

                orders = isFinite(orders) ? orders : null;

                console.log(orders)

                this.setState({
                    highestBidOrder : orders
                })
            }
        }
    };



    render () {
        if (this.state.transfer) {
            return (
                <tr key={uuid()}>
                    <td className="blue-link-text">
                        <Link to={"/asset-exchange/" + this.state.transfer.asset}>{this.state.transfer.name}</Link>
                    </td>
                    <td className="align-right">
                        {(this.state.transfer.quantityATU / Math.pow(10, this.state.transfer.decimals)).toFixed(this.state.transfer.decimals)}
                    </td>
                    <td className="align-right">{(this.state.transfer.initialQuantityATU  / Math.pow(10, this.state.transfer.decimals)).toFixed(this.state.transfer.decimals)}</td>
                    <td className="align-right">
                        {((parseInt(this.state.transfer.quantityATU) / parseInt(this.state.transfer.initialQuantityATU)) * 100).toFixed(2)}&nbsp;%
                    </td>
                    {
                        !this.props.info &&
                        <React.Fragment>
                            <td className="align-right" >
                                {
                                    !!(this.state.lowestAskOrder / Math.pow(10, 8) * Math.pow(10, this.state.transfer.decimals)) &&
                                    (this.state.lowestAskOrder / Math.pow(10, 8) * Math.pow(10, this.state.transfer.decimals)).toFixed(this.state.transfer.decimals)
                                }
                            </td>
                            <td className="align-right">
                                {
                                    !!(this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, this.state.transfer.decimals)) &&
                                    (this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, this.state.transfer.decimals)).toFixed(this.state.transfer.decimals)
                                }
                            </td>
                            <td className="align-right blue-link-text">
                                {
                                    !!(this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, this.state.transfer.decimals)) &&
                                    ((this.state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, this.state.transfer.decimals)) *
                                    (this.state.transfer.quantityATU / Math.pow(10, this.state.transfer.decimals))).toFixed(this.state.transfer.decimals)
                                }
                            </td>
                            <td className="align-right">
                                <div className="btn-box inline">
                                    <a
                                        onClick={() => this.props.setBodyModalParamsAction('TRANSFER_ASSET', {
                                            quantityATU: this.state.transfer.quantityATU,
                                            assetID:   this.state.transfer.asset,
                                            assetName: this.state.transfer.name
                                        })}
                                        className="btn primary blue"
                                    >
                                        Transfer
                                    </a>
                                    <a
                                        onClick={() => this.props.setBodyModalParamsAction('DELETE_SHARES', {
                                            quantityATU: this.state.transfer.quantityATU,
                                            assetID:   this.state.transfer.asset,
                                            assetName: this.state.transfer.name
                                        })}
                                        className="btn primary blue"
                                    >
                                        Delete Shares
                                    </a>
                                </div>
                            </td>
                        </React.Fragment>
                    }
                </tr>
            );
        } else {
            return (
                <tr key={uuid()}></tr>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setMopalType: (type) => dispatch(setMopalType(type)),
    getAskOrders: asset => getAskOrders(asset),
    getBidOrders: asset => getBidOrders(asset),
});

export default connect(null, mapDispatchToProps)(MyAssetItem);