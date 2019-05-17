import React from 'react';
import {withRouter} from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import CustomTable from '../../../../components/tables/table';

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

class TradeHistoryExchange extends React.Component {
    handleFormSubmit = () => {
        if (this.props.wallet) {
            NotificationManager.error('This functionality will be delivered in May 2019.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    render() {
        const {currency} = this.props.currentCurrency;
        return (
            <div className={'card-block form-group-app p-0 h-400'}>
                <div className={'form-title white d-flex justify-content-between'}>
                    <p>Trade history</p>
                    <button
                        type={'button'}
                        className={'btn btn-sm'}
                        onClick={this.handleFormSubmit}
                    >
                        View All
                    </button>
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
                    tableData={buyOrders}
                    emptyMessage={'No trade history found.'}
                    TableRowComponent={(props) => (
                        <tr className={''}>
                            <td>{props.price}</td>
                            <td>{props.amount}</td>
                            <td className={'align-right'}>{props.total}</td>
                        </tr>
                    )}
                />
            </div>
        );
    }
}

export default withRouter(TradeHistoryExchange);