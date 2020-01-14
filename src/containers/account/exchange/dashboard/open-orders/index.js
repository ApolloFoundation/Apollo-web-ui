import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import CustomTable from '../../../../components/tables/table';
import {formatDivision} from '../../../../../helpers/format';
import {setBodyModalParamsAction} from '../../../../../modules/modals';
import {ONE_GWEI} from '../../../../../constants';

class TradeHistoryExchange extends React.Component {
    state = {
        actionType: 0,
    };

    handleCancel = (data) => {
        this.props.setBodyModalParamsAction('CONFIRM_CANCEL_ORDER', data);
    };

    handleActionType = (type) => {
        if (type === 1) {
            NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000);
            return;
        }
        this.setState({actionType: type});
    };

    render() {
        const {currentCurrency: {currency}, myOrders} = this.props;
        return (
            <div className={'wrap-card-square'}>
                <div className={'card card-light card-square bg-white'}>
                    <div className="card-body">
                        <div className={'tabs-wrap tabs-primary mb-3'}>
                            <div
                                className={`tab-item ${this.state.actionType === 0 ? 'active' : ''}`}
                                onClick={this.handleActionType.bind(this, 0)}
                            >
                                Open orders
                            </div>
                            <div
                                className={`tab-item ${this.state.actionType === 1 ? 'active' : ''}`}
                                onClick={this.handleActionType.bind(this, 1)}
                            >
                                Closed orders
                            </div>
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
                                    alignRight: false
                                }, {
                                    name: ``,
                                    alignRight: true,
                                    isRender: !(myOrders && myOrders.length > 0)
                                }
                            ]}
                            className={'table-sm'}
                            tableData={myOrders}
                            emptyMessage={'No open orders found.'}
                            TableRowComponent={(props) => {
                                const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                                const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 9);
                                const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                                return (
                                    <tr>
                                        <td className={`${props.type === 0 ? 'text-success' : 'text-danger'}`}>{pairRate}</td>
                                        <td>{offerAmount}</td>
                                        <td>{total}</td>
                                        <td className={'align-right'}>
                                            <button
                                                type={'button'}
                                                className="btn btn-sm p-0 btn-icon"
                                                onClick={() => this.handleCancel({
                                                    currency,
                                                    pairRate,
                                                    offerAmount,
                                                    total,
                                                    orderId: props.id,
                                                })}
                                            >
                                                <i className="zmdi zmdi-close"/>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(null, mapDispatchToProps)(TradeHistoryExchange);
