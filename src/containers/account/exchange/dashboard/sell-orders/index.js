import React from 'react';
import {connect} from 'react-redux';
import {getSellOpenOffers} from "../../../../../actions/wallet";
import {formatDivision} from "../../../../../helpers/format";
import {ONE_GWEI} from '../../../../../constants';

import CustomTable from '../../../../components/tables/table';
import ArrowDown from '../../../../../assets/arrow-down.png';

class SellOrders extends React.Component {
    state = {
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.currentCurrency !== state.currentCurrency) {
            return {
                currentCurrency: props.currentCurrency,
                page: 1,
                firstIndex: 0,
                lastIndex: 14,
            };
        }

        return null;
    }

    onPaginate = (page) => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.props.getSellOpenOffers(null, {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    };

    render() {
        const {currentCurrency, sellOrders} = this.props;
        return (
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
                        }, {
                            name: `Amount APL`,
                            alignRight: false
                        }, {
                            name: `Total ${currentCurrency.currency.toUpperCase()}`,
                            alignRight: true
                        }
                    ]}
                    className={'pt-0 no-min-height no-padding'}
                    tableData={sellOrders}
                    emptyMessage={'No orders found.'}
                    TableRowComponent={(props) => {
                        const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                        const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 3);
                        const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                        return (
                            <tr>
                                <td className={'red-text'}>{pairRate}</td>
                                <td>{offerAmount}</td>
                                <td className={'align-right'}>{total}</td>
                            </tr>
                        )
                    }}
                    isPaginate
                    page={this.state.page}
                    previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                    nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getSellOpenOffers: (currency, options) => dispatch(getSellOpenOffers(currency, options)),
});

export default connect(null, mapDispatchToProps)(SellOrders);
