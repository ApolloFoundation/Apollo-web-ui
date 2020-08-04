import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table';
import { setCurrentCurrencyAction } from '../../../../modules/exchange';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { getMyOfferHistory, getContractStatus } from '../../../../actions/wallet';
import { formatDivision, currencyTypes } from '../../../../helpers/format';
import { ONE_GWEI } from '../../../../constants';
import { BlockUpdater } from '../../../block-subscriber';
import InfoBox from '../../../components/info-box';

export default function OrderHistory() {
  const dispatch = useDispatch();

  const { wallets } = useSelector(state => state.account);
  const { currentCurrency, myOrderHistory, contractStatus } = useSelector(state => state.exchange);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(15);

  const listener = useCallback(() => {
    dispatch(getMyOfferHistory({
      firstIndex,
      lastIndex,
    }));
  }, [dispatch, firstIndex, lastIndex]);

  const handleSelectOrder = useCallback((data, hasFrozenMoney, selectOrderId) => {
    this.props.history.push({ pathname: `/order/${selectOrderId}` });
  }, []);

  const handleCancel = useCallback(data => {
    this.props.setBodyModalParamsAction('CONFIRM_CANCEL_ORDER', data);
  }, []);

  const onPaginate = useCallback(page => {
    this.setState({
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    }, () => {
      this.props.getMyOfferHistory({
        firstIndex: this.state.firstIndex,
        lastIndex: this.state.lastIndex,
      });
    });
  }, []);

  const statusOfOrder = useCallback(status => {
    const allStatuses = {
      0: 'Open',
      1: 'Pending',
      2: 'Expired',
      3: 'Cancel',
      4: 'Waiting approval',
      5: 'Closed',
      6: 'Accounting',
    };

    return allStatuses[status];
  }, []);

  useEffect(() => {
    if (this.props.wallets && this.state.loading) {
      this.props.getMyOfferHistory({
        firstIndex: this.state.firstIndex,
        lastIndex: this.state.lastIndex,
      });
      this.setState({ loading: false });
    }
  }, []);

  useEffect(() => {
    const wallets = localStorage.getItem('wallets');
    if (!wallets) {
      this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
    } else {
      this.props.getMyOfferHistory({
        firstIndex: this.state.firstIndex,
        lastIndex: this.state.lastIndex,
      });
      this.setState({ loading: false });
    }
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, []);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Order History"
      />
      <div className="exchange page-body container-fluid">
        {!isLoading ? (
          <div className="card-block primary form-group-app p-0 mb-3">
            <div className="form-title form-title-lg d-flex flex-column justify-content-between">
              <p className="title-lg">My orders</p>
            </div>
            <CustomTable
              header={[
                {
                  name: 'ID',
                  alignRight: false,
                }, {
                  name: 'Height',
                  alignRight: false,
                }, {
                  name: 'Pair name',
                  alignRight: false,
                }, {
                  name: 'Type',
                  alignRight: false,
                }, {
                  name: 'Price',
                  alignRight: false,
                }, {
                  name: 'Amount',
                  alignRight: false,
                }, {
                  name: 'Total',
                  alignRight: false,
                }, {
                  name: 'Status',
                  alignRight: false,
                }, {
                  name: '',
                  alignRight: true,
                },
              ]}
              className="no-min-height transparent"
              emptyMessage="No created orders."
              tableData={myOrderHistory}
              defaultRowCount={15}
              TableRowComponent={props => {
                const statusName = statusOfOrder(props.status);
                const typeName = props.type ? 'SELL' : 'BUY';
                const pairRate = formatDivision(props.pairRate, ONE_GWEI, 9);
                const offerAmount = formatDivision(props.offerAmount, ONE_GWEI, 9);
                const total = formatDivision(props.pairRate * props.offerAmount, 10 ** 18, 9);
                const currency = props.pairCurrency;
                const type = Object.keys(currencyTypes).find(key => currencyTypes[key] === currency).toUpperCase();
                let trProps = '';
                if (!props.hasFrozenMoney && props.status === 0) {
                  trProps = {
                    'data-custom': true,
                    'data-custom-at': 'top',
                    'data-cat-id': JSON.stringify({ infoContent: 'Order cant be matched, your deposit doesnt allow to freeze funds' }),
                  };
                }
                return (
                  <tr
                    onClick={() => handleSelectOrder(
                      {
                        pairRate, offerAmount, total, currency, typeName, statusName, type,
                      },
                      props.hasFrozenMoney,
                      props.id,
                    )}
                    {...trProps}
                    className="history-order-active"
                  >
                    <td>{props.id}</td>
                    <td>{props.height}</td>
                    <td>
                      APL/
                      {type.toUpperCase()}
                    </td>
                    <td>{typeName}</td>
                    <td className={`${props.type ? 'red-text' : 'green-text'}`}>{pairRate}</td>
                    <td>{offerAmount}</td>
                    <td>{total}</td>
                    <td className={`${props.status ? 'red-text' : ''}`}>{statusName}</td>
                    <td className="align-right">
                      {props.status === 0 && (
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={event => {
                          event.stopPropagation();
                          handleCancel({
                            currency: type,
                            pairRate,
                            offerAmount,
                            total,
                            orderId: props.id,
                          });
                        }}
                      >
                        Cancel
                      </button>
                      )}
                    </td>
                  </tr>
                );
              }}
              isPaginate
              page={page}
              previousHendler={() => onPaginate(page - 1)}
              nextHendler={() => onPaginate(page + 1)}
              itemsPerPage={15}
            />
          </div>
        ) : (
          <div>
            <InfoBox default>
              You have no Wallet at the moment.&nbsp;
              <span
                className="blue-link-text"
                onClick={() => dispatch(setBodyModalParamsAction('LOGIN_EXCHANGE', {}))}
              >
                Log in
              </span>
            </InfoBox>
          </div>
        )}
      </div>
    </div>
  );
}
