import React from 'react';
import {connect} from 'react-redux';
import {getBuyOpenOffers} from "../../../../../actions/wallet";
import BuyOrders from "./BuyOrders";
import SellOrders from "./SellOrders";

class Orderbook extends React.Component {
    state = {
        actionType: 0,
    };

    handleActionType = (type) => {
        this.setState({actionType: type});
    };

    render() {
        const {currentCurrency, buyOrders, sellOrders} = this.props;
        return (
            <div className={'card card-light h-100'}>
                <div className="card-title">
                    <div className={'title'}>Orderbook</div>
                </div>
                <div className="card-body">
                    <div className={'tabs-wrap tabs-primary mb-3'}>
                        <div
                            className={`tab-item ${this.state.actionType === 0 ? 'active' : ''}`}
                            onClick={this.handleActionType.bind(this, 0)}
                        >
                            All
                        </div>
                        <div
                            className={`tab-item ${this.state.actionType === 1 ? 'active' : ''}`}
                            onClick={this.handleActionType.bind(this, 1)}
                        >
                            Buy Orders
                        </div>
                        <div
                            className={`tab-item ${this.state.actionType === 2 ? 'active' : ''}`}
                            onClick={this.handleActionType.bind(this, 2)}
                        >
                            Sell Orders
                        </div>
                    </div>
                    {(this.state.actionType === 0 || this.state.actionType === 2) && (
                        <SellOrders
                            currentCurrency={currentCurrency}
                            sellOrders={sellOrders}
                        />
                    )}
                    {this.state.actionType === 0 && (
                        <div className={'card card-price'}>
                            <div className={'card-body'}>
                                <div className={'price-wrap'}>
                                    <div>
                                        <p className={'text-success price text-ellipsis'}>
                                            <i className="zmdi zmdi-long-arrow-up"/> 0.000017654
                                        </p>
                                        <p className={'text-right'}>≈ 0.0019$</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {(this.state.actionType === 0 || this.state.actionType === 1) && (
                        <BuyOrders
                            currentCurrency={currentCurrency}
                            buyOrders={buyOrders}
                        />
                    )}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getBuyOpenOffers: (currency, options) => dispatch(getBuyOpenOffers(currency, options)),
});

export default connect(null, mapDispatchToProps)(Orderbook);
