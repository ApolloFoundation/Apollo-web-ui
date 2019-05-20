import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import CustomTable from '../../../../components/tables/table';
import {formatDivision} from '../../../../../helpers/format';
import {setBodyModalParamsAction} from '../../../../../modules/modals';
import {ONE_APL} from '../../../../../constants';

class TradeHistoryExchange extends React.Component {
    handleCancel = (data) => {
        this.props.setBodyModalParamsAction('CONFIRM_CANCEL_ORDER', data);
    };

    render() {
        const {currentCurrency: {currency}, myOrders} = this.props;
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
                            alignRight: false
                        }, {
                            name: ``,
                            alignRight: true
                        }
                    ]}
                    className={'pt-0 no-min-height pb-4'}
                    tableData={myOrders}
                    emptyMessage={'No open orders found.'}
                    TableRowComponent={(props) => {
                        const pairRate = formatDivision(props.pairRate, ONE_APL, 9);
                        const offerAmount = formatDivision(props.offerAmount, ONE_APL, 3);
                        const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 16), 9);
                        return (
                            <tr>
                                <td className={`${props.type === 0 ? 'green-text' : 'red-text'}`}>{pairRate}</td>
                                <td>{offerAmount}</td>
                                <td>{total}</td>
                                <td className={'align-right'}>
                                    <button
                                        type={'button'}
                                        className="btn btn-sm"
                                        onClick={() => this.handleCancel({
                                            currency,
                                            pairRate,
                                            offerAmount,
                                            total,
                                            orderId: props.id,
                                        })}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        )
                    }}
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(null, mapDispatchToProps)(TradeHistoryExchange);
