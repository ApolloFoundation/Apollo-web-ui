import React from 'react';
import {connect} from 'react-redux';
import {getBuyOpenOffers} from "../../../../../actions/wallet";
import {formatDivision} from '../../../../../helpers/format';
import {ONE_GWEI} from '../../../../../constants';
import CustomTable from '../../../../components/tables/table';
import ArrowUp from '../../../../../assets/arrow-up.png';

class BuyOrders extends React.Component {
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
            this.props.getBuyOpenOffers(null, {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    };

    render() {
        const {currentCurrency, buyOrders} = this.props;
        return (
                <CustomTable
                    header={[
                        {
                            name: `Price ${currentCurrency.currency.toUpperCase()}`,
                            alignRight: false
                        }, {
                            name: `Amount APL`,
                            alignRight: true
                        }, {
                            name: `Total ${currentCurrency.currency.toUpperCase()}`,
                            alignRight: true
                        }
                    ]}
                    className={'table-sm orderbook'}
                    tableData={buyOrders}
                    emptyMessage={'No buy orders found.'}
                    TableRowComponent={(props) => {
                        const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                        const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 3);
                        const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                        return (
                            <tr className={'success'}>
                                <td className={'text-success'}>{pairRate}</td>
                                <td className={'align-right'}>{offerAmount}</td>
                                <td className={'align-right'}>{total}</td>
                            </tr>
                        )
                    }}
                    isPaginate
                    page={this.state.page}
                    previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                    nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getBuyOpenOffers: (currency, options) => dispatch(getBuyOpenOffers(currency, options)),
});

export default connect(null, mapDispatchToProps)(BuyOrders);
