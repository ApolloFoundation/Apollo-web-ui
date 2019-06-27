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
            NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    render() {
        const {currency} = this.props.currentCurrency;
        return (
            <div className={'card card-light triangle-bg card-square'}>
                <div className="card-body">
                    <div className={'tabs-wrap tabs-primary mb-3'}>
                        <div className={'tab-item w-auto active'}>
                            Trade history
                        </div>
                    </div>
                    <CustomTable
                        header={[
                            {
                                name: `Price ${currency.toUpperCase()}`,
                                alignRight: false
                            }, {
                                name: `Amount APL`,
                                alignRight: true
                            }, {
                                name: `Total ${currency.toUpperCase()}`,
                                alignRight: true
                            }
                        ]}
                        className={'table-sm'}
                        tableData={buyOrders}
                        emptyMessage={'No trade history found.'}
                        TableRowComponent={(props) => (
                            <tr className={''}>
                                <td>{props.price}</td>
                                <td className={'align-right'}>{props.amount}</td>
                                <td className={'align-right'}>{props.total}</td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(TradeHistoryExchange);