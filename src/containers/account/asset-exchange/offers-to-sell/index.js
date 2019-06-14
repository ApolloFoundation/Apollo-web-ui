import React from 'react';
import OrderItem from "../order";

const OffersToSell = ({askOrders, asset}) => (
    <div className={'card'}>
        <div className="card-title">Offers to sell {asset.name}</div>
        <div className="card-body">
                {
                    askOrders &&
                    askOrders.length === 0 ?
                        <div className="info-box simple">
                            <p>No sell offers for this asset.</p>
                        </div> :
                        <div className="transaction-table no-min-height p-0">
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
                }
        </div>
    </div>
);

export default OffersToSell;
