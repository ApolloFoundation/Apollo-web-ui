import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {formatDivision} from '../../../../../helpers/format';
import {ONE_GWEI} from '../../../../../constants';
import {NotificationManager} from "react-notifications";
import {BlockUpdater} from "../../../../block-subscriber";
import {getMyTradeHistory} from '../../../../../actions/wallet';
import CustomTable from '../../../../components/tables/table';

class TradeHistoryExchange extends React.Component {

    componentDidMount() {
        this.props.getMyTradeHistory();
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };

    listener = () => {
        this.props.getMyTradeHistory();
    };

    handleFormSubmit = () => {
        if (this.props.wallet) {
            NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    render() {
        const {myTradeHistory, currentCurrency: {currency}} = this.props;
        return (
            <div className={'card card-light triangle-bg card-square'}>
                <div className="card-body">
                    <div className={'tabs-wrap tabs-primary mb-3'}>
                        <Link to='/trade-history-exchange' className={'tab-item w-auto active'}>
                            Trade history
                        </Link>
                    </div>
                    {myTradeHistory
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
                        tableData={myTradeHistory[currency]}
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
    myTradeHistory: exchange.myTradeHistory,
});

const mapDispatchToProps = dispatch => ({
    getMyTradeHistory: (options) => dispatch(getMyTradeHistory(options)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TradeHistoryExchange));