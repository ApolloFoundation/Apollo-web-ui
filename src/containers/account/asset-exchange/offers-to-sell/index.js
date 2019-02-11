import React from 'react';
import OrderItem from "../order/index"

const OffersToSell = ({askOrders, asset}) => (
    <div 
        className="card ballance card-tiny medium-padding mb-3 h-100"
        style={{marginBottom: 0}}
    >
        <div className="form-group-app">
            <div className="form-title">
                <p>Offers to sell {asset.name}</p>
            </div>
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
                                    askOrders &&
                                    askOrders.length > 0 ?
                                    askOrders.map(el => {
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
            </div>
        </div>
                                    
)

export default OffersToSell;