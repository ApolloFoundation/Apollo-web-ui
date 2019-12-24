import React from 'react';
import {connect} from 'react-redux';
import {getBuyOpenOffers} from "../../../../../actions/wallet";
import {setSelectedOrderInfo} from "../../../../../modules/modals";
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
                lastIndex: 15,
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
            lastIndex: page * 15
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
                defaultRowCount={15}
                tableData={buyOrders}
                emptyMessage={'No buy orders found.'}
                TableRowComponent={(props) => {
                    const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                    const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 9);
                    const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                    return (
                        <tr onClick={() => this.props.setSelectedOrderInfo({pairRate, offerAmount, total, type: 'SELL'})} className={'success'}>
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
                itemsPerPage={15}
            />
        );
    }
}

const mapStateToProps = ({exchange}) => ({
    pagination: exchange.buyOrdersPagination,
});

const mapDispatchToProps = dispatch => ({
    getBuyOpenOffers: (currency, options) => dispatch(getBuyOpenOffers(currency, options)),
    setSelectedOrderInfo: (data) => dispatch(setSelectedOrderInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyOrders);
