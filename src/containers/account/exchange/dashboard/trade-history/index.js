import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {formatDivision} from '../../../../../helpers/format';
import {ONE_GWEI} from '../../../../../constants';
import {NotificationManager} from "react-notifications";
import {BlockUpdater} from "../../../../block-subscriber";
import {getMyOpenOffers} from '../../../../../actions/wallet';
import CustomTable from '../../../../components/tables/table';

class TradeHistoryExchange extends React.Component {

    componentDidMount() {
        this.props.getMyOpenOffers();
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };

    listener = () => {
        this.props.getMyOpenOffers();
    };

    handleFormSubmit = () => {
        if (this.props.wallet) {
            NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    render() {
        const {myOrders, currentCurrency: {currency}} = this.props;
        return (
            <div className={'card card-light triangle-bg card-square'}>
                <div className="card-body">
                    <div className={'tabs-wrap tabs-primary mb-3'}>
                        <Link to='/trade-history-exchange' className={'tab-item w-auto active'}>
                            Trade history
                        </Link>
                    </div>
                    {myOrders 
                    ? <CustomTable
                        header={[
                            {
                                name: 'Price',
                                alignRight: false
                            }, {
                                name: 'Amount APL',
                                alignRight: false
                            }, {
                                name: 'Total',
                                alignRight: false
                            }
                        ]}
                        className={'table-sm'}
                        tableData={myOrders[currency]}
                        emptyMessage={'No trade history found.'}
                        TableRowComponent={(props) => {
                            const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                            const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 3);
                            const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                            return (
                                <tr>
                                    <td>{pairRate}</td>
                                    <td>{offerAmount}</td>
                                    <td>{total}</td>
                                </tr>
                            )
                        }}
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

const mapStateToProps = ({exchange}) => ({
    myOrders: exchange.myOrders,
});

const mapDispatchToProps = dispatch => ({
    getMyOpenOffers: (options) => dispatch(getMyOpenOffers(options)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TradeHistoryExchange));