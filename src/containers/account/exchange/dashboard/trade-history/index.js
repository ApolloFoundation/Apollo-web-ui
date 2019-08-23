import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import CustomTable from '../../../../components/tables/table';

class TradeHistoryExchange extends React.Component {
    handleFormSubmit = () => {
        if (this.props.wallet) {
            NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    render() {
        const {buyOrders, currentCurrency: {currency}} = this.props;

        return (
            <div className={'card card-light triangle-bg card-square'}>
                <div className="card-body">
                    <div className={'tabs-wrap tabs-primary mb-3'}>
                        <Link to='/trade-history-exchange' className={'tab-item w-auto active'}>
                            Trade history
                        </Link>
                    </div>
                    {buyOrders.eth 
                    ? <CustomTable
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
                        tableData={buyOrders.eth.map(i => ({
                            price: i.pairRate,
                            amount: i.offerAmount,
                            total: i.pairRate
                        }))}
                        emptyMessage={'No trade history found.'}
                        TableRowComponent={(props) => (
                            <tr className={''}>
                                <td>{props.price}</td>
                                <td className={'align-right'}>{props.amount}</td>
                                <td className={'align-right'}>{props.total}</td>
                            </tr>
                        )}
                    />
                    : <div className={'align-items-center loader-box'}>
                        <div className="ball-pulse">
                            <div/>
                            <div/>
                            <div/>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    buyOrders: state.exchange.buyOrders,
});

export default withRouter(connect(mapStateToProps, null)(TradeHistoryExchange));