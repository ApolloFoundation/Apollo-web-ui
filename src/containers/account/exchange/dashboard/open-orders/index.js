import React from 'react';
import CustomTable from '../../../../components/tables/table';
import {formatDivision} from "../../../../../helpers/format";
import {Link} from "react-router-dom";

const TradeHistoryExchange = ({currentCurrency: {currency}, myOrders}) => {
    return (
        <div className={'card-block form-group-app p-0 h-400'}>
            <div className={'form-title d-flex justify-content-between'}>
                <p>My Open Orders</p>
                <Link
                    to={'/order-history'}
                    className="btn btn-sm"
                >
                    View All
                </Link>
            </div>
            <CustomTable
                header={[
                    {
                        name: `Price ${currency.toUpperCase()}`,
                        alignRight: false
                    }, {
                        name: `Amount APL`,
                        alignRight: false
                    }, {
                        name: `Total ${currency.toUpperCase()}`,
                        alignRight: true
                    }
                ]}
                className={'pt-0 no-min-height pb-4'}
                tableData={myOrders}
                emptyMessage={'No open orders found.'}
                TableRowComponent={(props) => {
                    const pairRate = formatDivision(props.pairRate, 100000000, 9);
                    const offerAmount = formatDivision(props.offerAmount, 100000000, 3);
                    const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 16), 9);
                    return (
                        <tr>
                            <td className={`${props.type === 0 ? 'green-text' : 'red-text'}`}>{pairRate}</td>
                            <td>{offerAmount}</td>
                            <td className={'align-right'}>{total}</td>
                        </tr>
                    )
                }}
            />
        </div>
    );
};

export default TradeHistoryExchange;