import React, {
  useState, useEffect, useCallback,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { currencyTypes, formatDivision } from '../../../../helpers/format';
import { ONE_GWEI } from '../../../../constants';
import { ALL_STATUSES } from '../../../../constants/statuses';
import {
  getAllContractStatus, getContractStatus, getOrderById,
} from '../../../../actions/wallet';
import SiteHeader from '../../../components/site-header';
import ContentLoader from '../../../components/content-loader';
import Button from '../../../components/button';
import InfoBox from '../../../components/info-box';
import { getAccountInfoSelector, getExchangeInfoSelector } from '../../../../selectors';
import { OrderDetailsForm } from './OrderDetailsForm';

export default function OrderDetails() {
  const dispatch = useDispatch();

  const account = useSelector(getAccountInfoSelector, shallowEqual);
  const { allContractStatus, selectedContractStatus } = useSelector(getExchangeInfoSelector, shallowEqual);

  const [isPending, setIsPending] = useState(true);
  const [isShowingContractHistory, setIsShowingContractHistory] = useState(false);
  const [selectOrderId, setSelectOrderId] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);

  const match = useRouteMatch();
  const history = useHistory();

  const handleBack = useCallback(() => {
    history.push({ pathname: '/order-history' });
  }, [history]);

  const handleOpenContractHistory = useCallback(() => {
    if (!(allContractStatus && allContractStatus.length)) {
      NotificationManager.error('No contracts found.', 'Error', 5000);
      return;
    }
    setIsShowingContractHistory(!isShowingContractHistory);
  }, [allContractStatus, isShowingContractHistory]);

  const getOrder = useCallback(async orderId => {
    const currentOrderInfo = await dispatch(getOrderById(orderId));
    if (currentOrderInfo) {
      dispatch(getContractStatus({ orderId, accountId: currentOrderInfo.accountId }));
      dispatch(getAllContractStatus({ orderId, accountId: currentOrderInfo.accountId }));

      const pairRate = formatDivision(currentOrderInfo.pairRate, ONE_GWEI, 9);
      const offerAmount = formatDivision(currentOrderInfo.offerAmount, ONE_GWEI, 9);
      const total = formatDivision(
        currentOrderInfo.pairRate * currentOrderInfo.offerAmount, 10 ** 18, 9,
      );
      const currency = currentOrderInfo.pairCurrency;
      const statusName = ALL_STATUSES[currentOrderInfo.status];
      const typeName = currentOrderInfo.type ? 'SELL' : 'BUY';
      const type = Object.keys(currencyTypes)
        .find(key => currencyTypes[key] === currency).toUpperCase();

      setIsPending(false);
      setSelectOrderId(orderId);
      setOrderInfo({
        ...currentOrderInfo, pairRate, offerAmount, total, currency, typeName, statusName, type,
      });
    } else {
      setIsPending(false);
      setSelectOrderId(orderId);
    }
  }, [dispatch]);

  useEffect(() => {
    if (match.params.id) {
      getOrder(match.params.id);
    }
  }, []);

  const isShowSelectedContractStatus = orderInfo && !!(orderInfo.statusName !== 'Open' && selectedContractStatus && selectedContractStatus.length);
  const currentContractOrder = selectedContractStatus && selectedContractStatus.reduce(
    (res, order) => (res.contractStatus <= order.contractStatus ? order : res),
    { contractStatus: 0 },
  );

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Order Details" />
      <div className="page-body container-fluid full-screen-block mb-3">
        {!isPending ? (
          <div className="account-settings">
            <div className="page-settings-item">
              {selectOrderId && (
              <div className="card full-height mb-3">
                <div className="card-title">
                  Order
                  {selectOrderId}
                  <div>
                    <Button
                      className="mr-3"
                      onClick={handleBack}
                      name="Back to list"
                    />
                    {orderInfo && (
                      <Button
                        name={isShowingContractHistory ? 'Hide more details' : 'Show more details'}
                        color="green"
                        disabled={!(allContractStatus && allContractStatus.length)}
                        onClick={handleOpenContractHistory}
                      />
                    )}
                  </div>
                </div>
                <div className="card-body">
                  {orderInfo ? (
                    <>
                      {!orderInfo.hasFrozenMoney && orderInfo.status === 0 && (
                      <InfoBox default>
                        Order cant be matched, your deposit doesn't allow to freeze
                        funds.
                      </InfoBox>
                      )}
                      <OrderDetailsForm 
                        account={account}
                        allContractStatus={allContractStatus}
                        selectedContractStatus={selectedContractStatus}
                        isShowSelectedContractStatus={isShowSelectedContractStatus}
                        orderInfo={orderInfo}
                        isShowingContractHistory={isShowingContractHistory}
                        currentContractOrder={currentContractOrder}
                      />
                    </>
                  ) : (
                    <InfoBox default>
                      Order not found.
                    </InfoBox>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        ) : (
          <ContentLoader />
        )}
      </div>
    </div>
  );
}
