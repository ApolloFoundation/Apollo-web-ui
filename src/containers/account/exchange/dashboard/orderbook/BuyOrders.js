import React from 'react';
import {connect} from 'react-redux';
import {getBuyOpenOffers} from "../../../../../actions/wallet";
import {formatDivision} from '../../../../../helpers/format';
import {ONE_GWEI} from '../../../../../constants';
import CustomTable from '../../../../components/tables/table';

class BuyOrders extends React.Component {
    state = {
        currentCurrency: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.currentCurrency !== state.currentCurrency) {
            const pagination = {
                page: 1,
                firstIndex: 0,
                lastIndex: 14,
            };
            props.getBuyOpenOffers(null, pagination);
            return {
                currentCurrency: props.currentCurrency,
            };
        }

        return null;
    }

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15 - 1
        };

        this.props.getBuyOpenOffers(null, pagination);
    };

    render() {
        const {currentCurrency, buyOrders, pagination} = this.props;
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
                page={pagination.page}
                previousHendler={this.onPaginate.bind(this, pagination.page - 1)}
                nextHendler={this.onPaginate.bind(this, pagination.page + 1)}
            />
        );
    }
}

const mapStateToProps = ({exchange}) => ({
    pagination: exchange.buyOrdersPagination,
});

const mapDispatchToProps = dispatch => ({
    getBuyOpenOffers: (currency, options) => dispatch(getBuyOpenOffers(currency, options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyOrders);
