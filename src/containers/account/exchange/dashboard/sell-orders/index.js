import React from 'react';
import {formatDivision} from "../../../../../helpers/format";
import CustomTable from '../../../../components/tables/table';
import ArrowDown from '../../../../../assets/arrow-down.png';

const SellOrders = ({currentCurrency, sellOrders}) => (
    <div className={'card-block primary form-group-app p-0 h-400'}>
        <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
            <p>Orderbook</p>
            <div className={'form-title-actions'}>
                <button className={'btn btn-transparent pl-0 btn-disabled'}>
                    <img src={ArrowDown} alt="Sell Arrow"/> SELL ORDERS
                </button>
            </div>
        </div>
        <CustomTable
            header={[
                {
                    name: `Price ${currentCurrency.currency.toUpperCase()}`,
                    alignRight: false
                },{
                    name: `Amount APL`,
                    alignRight: false
                },{
                    name: `Total ${currentCurrency.currency.toUpperCase()}`,
                    alignRight: true
                }
            ]}
            className={'mb-3 pt-0 no-min-height no-padding'}
            tableData={sellOrders}
            emptyMessage={'No orders found.'}
            TableRowComponent={(props) => {
                const pairRate = formatDivision(props.pairRate, 100000000, 9);
                const offerAmount = formatDivision(props.offerAmount, 100000000, 3);
                const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 16), 9);
                return (
                    <tr>
                        <td className={'red-text'}>{pairRate}</td>
                        <td>{offerAmount}</td>
                        <td className={'align-right'}>{total}</td>
                    </tr>
                )
            }}
        />
    </div>
);

export default SellOrders;