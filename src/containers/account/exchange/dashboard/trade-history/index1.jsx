import React, { useEffect, useCallback } from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {formatDivision} from '../../../../../helpers/format';
import {ONE_GWEI} from '../../../../../constants';
import {BlockUpdater} from "../../../../block-subscriber";
import {getMyTradeHistory} from '../../../../../actions/wallet';
import ArrowUp from "../../../../../assets/arrow-up.png";
import ArrowDown from "../../../../../assets/arrow-down.png";
import CustomTable from '../../../../components/tables/table1';

const itemsPerPage = 15;

export default function TradeHistoryExchange(props) {
  const dispatch = useDispatch();

  const { currentCurrency, wallet, handleLoginModal } = props;

  const [page, setPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(itemsPerPage);
  const [currency, setСurrency] = useState(null);

  const listener = useCallback(() => {
    dispatch(getMyTradeHistory(currency.currency, {
        page: page,
        firstIndex: firstIndex,
        lastIndex: lastIndex,
    }));
  }, []);

  const onPaginate = useCallback(async (page = 1) => {
    const pagination = {
        page: page,
        firstIndex: page * itemsPerPage - itemsPerPage,
        lastIndex: page * itemsPerPage,
    };

    await dispatch(getMyTradeHistory(currency.currency, pagination));
  }, []);

  useEffect(() => {
    BlockUpdater.on("data", listener);

    return () => BlockUpdater.removeListener("data", listener)
  }, [])

  useEffect(() => {
    if (currentCurrency !== currency) {
        const pagination = {
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage,
        };
        dispatch(getMyTradeHistory(currentCurrency.currency, pagination));
        setСurrency(currentCurrency);
    }
  }, []);

  return (
    <div className={'wrap-card-square'}>
        <div className={'card card-light triangle-bg card-square'}>
            <div className="card-body">
                <div className={'tabs-wrap tabs-primary mb-3'}>
                    <Link to='/trade-history-exchange' className={'tab-item w-auto active'}>
                        Trade history
                    </Link>
                </div>
                {myTradeHistory[currentCurrency.currency]
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
                        tableData={myTradeHistory[currentCurrency.currency]}
                        emptyMessage={'No trade history found.'}
                        TableRowComponent={(props) => {
                            const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                            const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 9);
                            const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                            return (
                                <tr>
                                    <td><img className={'arrow'} src={props.type ? ArrowDown : ArrowUp}
                                             alt={'Apollo'}/>{pairRate}</td>
                                    <td>{offerAmount}</td>
                                    <td>{total}</td>
                                </tr>
                            )
                        }}
                        isPaginate
                        page={this.state.page}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                        itemsPerPage={itemsPerPage}
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
    </div>
  );
}
class TradeHistoryExchange extends React.Component {
    state = {
        page: 1,
        firstIndex: 0,
        lastIndex: itemsPerPage,
        currentCurrency: null,
    };

    componentDidMount() {
        BlockUpdater.on("data", this.listener);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentCurrency !== state.currentCurrency) {
            const pagination = {
                page: 1,
                firstIndex: 0,
                lastIndex: itemsPerPage,
            };
            props.getMyTradeHistory(props.currentCurrency.currency, pagination);
            return {
                currentCurrency: props.currentCurrency,
            };
        }

        return null;
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    };

    listener = () => {
        this.props.getMyTradeHistory(this.state.currentCurrency.currency, {
            page: this.state.page,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
        });
    };

    handleFormSubmit = () => {
        if (this.props.wallet) {
            NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000);
        } else {
            this.props.handleLoginModal();
        }
    };

    onPaginate = async (page = 1) => {
        const pagination = {
            page: page,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage,
        };

        await this.props.getMyTradeHistory(this.state.currentCurrency.currency, pagination);
        this.setState(pagination);
    };

    render() {
        const {myTradeHistory, currentCurrency: {currency}} = this.props;
        return (
            <div className={'wrap-card-square'}>
                <div className={'card card-light triangle-bg card-square'}>
                    <div className="card-body">
                        <div className={'tabs-wrap tabs-primary mb-3'}>
                            <Link to='/trade-history-exchange' className={'tab-item w-auto active'}>
                                Trade history
                            </Link>
                        </div>
                        {myTradeHistory[currency]
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
                                    const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 9);
                                    const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 18), 9);
                                    return (
                                        <tr>
                                            <td><img className={'arrow'} src={props.type ? ArrowDown : ArrowUp}
                                                     alt={'Apollo'}/>{pairRate}</td>
                                            <td>{offerAmount}</td>
                                            <td>{total}</td>
                                        </tr>
                                    )
                                }}
                                isPaginate
                                page={this.state.page}
                                previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                                nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                                itemsPerPage={itemsPerPage}
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
            </div>
        );
    }
}

const mapStateToProps = ({exchange}) => ({
    myTradeHistory: exchange.myTradeHistory,
});

const mapDispatchToProps = dispatch => ({
    getMyTradeHistory: (currency, options) => dispatch(getMyTradeHistory(currency, options)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TradeHistoryExchange));
