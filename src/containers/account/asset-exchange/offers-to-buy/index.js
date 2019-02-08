import React from 'react';
import OrderItem from "../order/index"

const OffersToBuy = ({bidOrders, asset}) => (
    <div 
        className="card assets card-tiny medium-padding h-100"
        style={{marginBottom: 0}}
    >
        <div className="form-group-app">
            <div className="form-title">
                <p>Offers to buy {asset.name}</p>
            </div>
            {
                bidOrders &&
                bidOrders.length === 0 ?
                    <div className="info-box simple">
                        <p>No buy offers for this asset.</p>
                    </div> :
                    <div className="transaction-table no-min-height">
                        <div className="transaction-table-body">
                            <table>
                                <thead>
                                    <tr>
                                        <td className="align-left">Asset</td>
                                        <td>Quantity</td>
                                        <td className="align-left">Price</td>
                                        <td className="align-right">Total</td>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    bidOrders &&
                                    bidOrders.length > 0 ?
                                    bidOrders.map(el => {
                                            return (
                                                <OrderItem
                                                    key={el.asset}
                                                    order={el}
                                                />
                                            )
                                        }) : <p>No delete history</p>
                                }
                                </tbody>
                            </table>

                        </div>
                    </div>
            }

        </div>
    </div>
                                    
)

export default OffersToBuy;