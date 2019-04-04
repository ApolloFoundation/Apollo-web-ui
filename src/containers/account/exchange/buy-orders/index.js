import React from 'react';
import CustomTable from '../../../components/tables/table';
import ArrowUp from '../../../../assets/arrow-up.png';
import buyOrders from '../buyOrders';

const BuyOrders = ({currentCurrency}) => (
    <div className={'card-block primary p-0'}>
        <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
            <p>Orderbook</p>
            <div className={'form-title-actions'}>
                <button className={'btn btn-transparent pl-0 btn-disabled'}>
                    <img src={ArrowUp} alt="Buy Arrow"/> BUY ORDERS
                </button>
            </div>
        </div>
        <CustomTable
            header={[
                {
                    name: `Price ${currentCurrency.currency.toUpperCase()}`,
                    alignRight: false
                },{
                    name: `Amount ${currentCurrency.currency.toUpperCase()}`,
                    alignRight: false
                },{
                    name: `Total ${currentCurrency.currency.toUpperCase()}`,
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