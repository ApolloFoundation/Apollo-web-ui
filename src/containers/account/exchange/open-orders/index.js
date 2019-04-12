import React from 'react';
import {withRouter} from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import CustomTable from '../../../components/tables/table';
import {formatDivision} from "../../../../helpers/format";

class TradeHistoryEchanger extends React.Component {
    handleFormSubmit = () => {
        if (this.props.wallet) {
            NotificationManager.error('This functionality will be delivered in April 2019.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    render() {
        const {currentCurrency: {currency}, myOrders} = this.props;
        return (
            <div className={'card-block form-group-app p-0 h-400'}>
                <div className={'form-title d-flex justify-content-between'}>
                    <p>My Open Orders</p>
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
                            name: `Amount ${currency.toUpperCase()}`,
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
                                <td className={`${props.orderType === 0} ? 'green-text' : 'red-text'`}>{pairRate}</td>
                                <td>{offerAmount}</td>
                                <td className={'align-right'}>{total}</td>
                            </tr>
                        )
                    }}
                />
            </div>
        );
    }
}

export default withRouter(TradeHistoryEchanger);