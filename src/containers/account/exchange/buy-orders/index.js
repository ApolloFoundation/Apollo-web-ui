import React from 'react';
import CustomTable from '../../../components/tables/table';
import ArrowUp from '../../../../assets/arrow-up.png';

const buyOrders = [
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
];

const BuyOrders = () => (
    <div className={'card-block primary p-0'}>
        <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
            <p>Orderbook</p>
            <div className={'form-title-actions'}>
                <button className={'btn btn-transparent active'}>
                    <img src={ArrowUp} alt="Buy Arrow"/> BUY ORDERS
                </button>
            </div>
        </div>
        <CustomTable
            header={[
                {
                    name: 'Price ETH',
                    alignRight: false
                },{
                    name: 'Amount ETH',
                    alignRight: false
                },{
                    name: 'Total ETH',
                    alignRight: true
                }
            ]}
            className={'mb-3 pt-0 no-min-height no-padding'}
            tableData={buyOrders}
            emptyMessage={'No account propertes found .'}
            TableRowComponent={(props) => (
                <tr className={''}>
                    <td className={'green-text'}>{props.price}</td>
                    <td>{props.amount}</td>
                    <td className={'align-right'}>{props.total}</td>
                </tr>
            )}
        />
    </div>
);

export default BuyOrders;