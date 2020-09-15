import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { getMyOfferHistory } from '../../../../actions/wallet';
import {
  formatDivision, currencyTypes, secureStorage,
} from '../../../../helpers/format';
import { ONE_GWEI } from '../../../../constants';
import { BlockUpdater } from '../../../block-subscriber';
import CustomTable from '../../../components/tables/table';
import SiteHeader from '../../../components/site-header';
import InfoBox from '../../../components/info-box';
import Button from '../../../components/button';

export default function OrderHistory() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { wallets, ticker } = useSelector(state => state.account);
  const { myOrderHistory } = useSelector(state => state.exchange);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [requstIndex, setRequstIndex] = useState({
    firstIndex: 0,
    lastIndex: 15,
  });

  const listener = useCallback(() => {
    dispatch(getMyOfferHistory(requstIndex));
  }, [dispatch, requstIndex]);

  const handleSelectOrder = useCallback((data, hasFrozenMoney, selectOrderId) => {
    history.push({ pathname: `/order/${selectOrderId}` });
  }, [history]);

  const handleCancel = useCallback(data => {
    dispatch(setBodyModalParamsAction('CONFIRM_CANCEL_ORDER', data));
  }, [dispatch]);

  const onPaginate = useCallback(async currPage => {
    const params = {
      firstIndex: currPage * 15 - 15,
      lastIndex: currPage * 15,
    };

    await dispatch(getMyOfferHistory(params));

    setPage(currPage);
    setRequstIndex(params);
  }, [dispatch]);

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
    if (wallets && isLoading) {
      dispatch(getMyOfferHistory(requstIndex));
      setIsLoading(false);
    }
  }, [dispatch, isLoading, wallets]);

  useEffect(() => {
    BlockUpdater.on('data', (listener));

    return () => BlockUpdater.removeListener('data', listener);
  }, [listener]);

  useEffect(() => {
    const localWallets = secureStorage.getItem('wallets');
    if (!localWallets) {
      dispatch(setBodyModalParamsAction('LOGIN_EXCHANGE', {}));
    } else {
      dispatch(getMyOfferHistory(requstIndex));
      setIsLoading(false);
    }
  }, [dispatch]);

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
            {myOrderHistory
              ? (
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
                          {ticker}
                          /
                          {type.toUpperCase()}
                        </td>
                        <td>{typeName}</td>
                        <td className={`${props.type ? 'red-text' : 'green-text'}`}>{pairRate}</td>
                        <td>{offerAmount}</td>
                        <td>{total}</td>
                        <td className={`${props.status ? 'red-text' : ''}`}>{statusName}</td>
                        <td className="align-right">
                          {props.status === 0 && (
                            <Button
                              size="sm"
                              name="Cancel"
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
                            />
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
              ) : (
                <div className="align-items-center loader-box">
                  <div className="ball-pulse">
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              )}
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
