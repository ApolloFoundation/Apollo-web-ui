import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table';
import {setCurrentCurrencyAction} from '../../../../modules/exchange';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {getMyTradeHistory} from '../../../../actions/wallet';
import {formatDivision, currencyTypes} from '../../../../helpers/format';
import {ONE_GWEI} from '../../../../constants';
import {BlockUpdater} from "../../../block-subscriber";
import InfoBox from '../../../components/info-box';

class TradeHistory extends React.Component {
    state = {
        loading: true,
        firstIndex: 0,
        lastIndex: 15,
        page: 1,
    };

    componentDidMount() {
        let wallets = localStorage.getItem('wallets');
        if (!wallets) {
            this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
        } else {
            this.props.getMyTradeHistory(null, {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
            this.setState({loading: false});
        }
        BlockUpdater.on("data", this.listener);
    };

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };

    componentDidUpdate() {
        if (this.props.wallets && this.state.loading) {
            this.props.getMyTradeHistory(null, {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
            this.setState({loading: false});
        }
    };

    handleSelectOrder = (data) => {
        this.props.setBodyModalParamsAction('SELECT_ORDER', data);
    };

    handleCancel = (data) => {
        this.props.setBodyModalParamsAction('CONFIRM_CANCEL_ORDER', data);
    };

    listener = () => {
        this.props.getMyTradeHistory(null, {
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    onPaginate = (page) => {
        this.setState({
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15
        }, () => {
            this.props.getMyTradeHistory(null, {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    };

    statusOfOrder = status => {
        const allStatuses = {
            0: 'Open',
            1: 'Pending',
            2: 'Expired',
            3: 'Cancel',
            4: 'Waiting approval',
            5: 'Closed',
        };

        return allStatuses[status];
    };

    render() {
        const {myTradeHistory, currentCurrency : {currency}} = this.props;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Trade History'}
                />
                <div className="exchange page-body container-fluid">
                    {!this.state.loading ? (
                    <div className={'card-block primary form-group-app p-0 mb-3'}>
                        <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
                            <p className="title-lg">My trades</p>
                        </div>
                            {!myTradeHistory['allTrades'] || !myTradeHistory['allTrades'].length
                            ?   <CustomTable
                                    header={[
                                        {
                                            name: 'Pair name',
                                            alignRight: false
                                        }, {
                                            name: 'Type',
                                            alignRight: false
                                        }, {
                                            name: 'Price',
                                            alignRight: false
                                        }, {
                                            name: 'Amount',
                                            alignRight: false
                                        }, {
                                            name: 'Total',
                                            alignRight: false
                                        }, {
                                            name: 'Status',
                                            alignRight: false
                                        }, {
                                            name: ``,
                                            alignRight: true
                                        }
                                    ]}
                                    className={'no-min-height transparent'}
                                    emptyMessage={'No created orders.'}
                                    defaultRowCount={15}
                                    tableData={myTradeHistory['allTrades']}
                                    TableRowComponent={(props) => {
                                        const statusName = this.statusOfOrder(props.status);
                                        const typeName = props.type ? 'SELL' : 'BUY';
                                        const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                                        const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 3);
                                        const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                                        const currency = props.pairCurrency;
                                        const type = Object.keys(currencyTypes).find(key => currencyTypes[key] === currency);
                                        return (
                                            <tr style={{cursor: 'pointer'}} onClick={() => this.handleSelectOrder({pairRate, offerAmount, total, currency, typeName, statusName})}>
                                                <td>APL/{type.toUpperCase()}</td>
                                                <td>{props.type ? 'SELL' : 'BUY'}</td>
                                                <td className={`${props.type ? 'red-text' : 'green-text'}`}>{pairRate}</td>
                                                <td>{offerAmount}</td>
                                                <td>{total}</td>
                                                <td className={`${props.status ? 'red-text' : ''}`}>{statusName}</td>
                                                <td className={'align-right'}>
                                                    {!props.status && (
                                                        <button
                                                            type={'button'}
                                                            className="btn btn-sm"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                this.handleCancel({
                                                                    currency: type,
                                                                    pairRate,
                                                                    offerAmount,
                                                                    total,
                                                                    orderId: props.id,
                                                                })
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    }}
                                    isPaginate
                                    page={this.state.page}
                                    previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                                    nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                                    itemsPerPage={15}
                                />
                            : <div className={'align-items-center loader-box'}>
                                <div className="ball-pulse">
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>}
                        </div>
                    ):(
                        <div>
                            <InfoBox default>
                                You have no Wallet at the moment.&nbsp;
                                <a className={'blue-link-text'} onClick={() => this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {})}>Log in</a>
                            </InfoBox>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({exchange, account}) => ({
    wallets: account.wallets,
    currentCurrency: exchange.currentCurrency,
    myTradeHistory: exchange.myTradeHistory
});

const mapDispatchToProps = dispatch => ({
    getMyTradeHistory: (currency, options) => dispatch(getMyTradeHistory(currency, options)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
    setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory)
