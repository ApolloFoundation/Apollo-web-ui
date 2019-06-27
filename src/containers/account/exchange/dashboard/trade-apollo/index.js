import React from 'react';
import {ONE_APL} from '../../../../../constants';
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

class TradeApollo extends React.Component {
    feeATM = 200000000;
    state = {
        actionType: 0,
    };

    handleActionType = (type) => {
        this.setState({actionType: type});
    };

    render() {
        const {buyOrders, sellOrders} = this.props;
        return (
            <div className={'card card-light'}>
                <div className="card-title">
                    <div className={'title'}>Trade Apollo</div>
                    <span className={'sub-title'}>Fee: {this.feeATM / ONE_APL} APL</span>
                </div>
                <div className="card-body">
                    <div className={'tabs-wrap mb-3'}>
                        <div
                            className={`tab-item ${this.state.actionType === 0 ? 'active' : ''}`}
                            onClick={this.handleActionType.bind(this, 0)}
                        >
                            Buy APL
                        </div>
                        <div
                            className={`tab-item ${this.state.actionType === 1 ? 'active' : ''}`}
                            onClick={this.handleActionType.bind(this, 1)}
                        >
                            Sell APL
                        </div>
                    </div>
                    {this.state.actionType === 0 ? (
                        <BuyForm
                            buyOrders={buyOrders}
                        />
                    ) : (
                        <SellForm
                            sellOrders={sellOrders}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default TradeApollo;
