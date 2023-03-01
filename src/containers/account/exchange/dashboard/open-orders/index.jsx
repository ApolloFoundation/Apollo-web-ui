import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from 'modules/modals';
import CustomTable from 'containers/components/tables/table1';
import { ONE_GWEI } from 'constants/constants';
import { bigIntDecimalsDivision, bigIntDivision, bigIntMultiply, bigIntFormat } from 'helpers/util/bigNumberWrappers';
import { numberToLocaleString } from 'helpers/format';

export default function OpenOrdersExchange(props) {
  const dispatch = useDispatch();

  const { currentCurrency: { currency }, myOrders, ticker } = props;

  const [actionType, setActionType] = useState(0);

  const handleCancel = useCallback(data => {
    dispatch(setBodyModalParamsAction('CONFIRM_CANCEL_ORDER', data));
  }, [dispatch]);

  const handleActionType = useCallback(type => {
    if (type === 1) {
      NotificationManager.error('This functionality will be delivered in future releases.', 'Error', 5000);
      return;
    }
    setActionType(type);
  }, []);

  return (
    <div className="wrap-card-square">
      <div className="card card-light card-square bg-white">
        <div className="card-body">
          <div className="tabs-wrap tabs-primary mb-3">
            <div
              className={`tab-item ${actionType === 0 ? 'active' : ''}`}
              onClick={() => handleActionType(0)}
            >
              Open orders
            </div>
            <div
              className={`tab-item ${actionType === 1 ? 'active' : ''}`}
              onClick={() => handleActionType(1)}
            >
              Closed orders
            </div>
          </div>
          <CustomTable
            header={[
              {
                name: `Price ${currency.toUpperCase()}`,
                alignRight: false,
              }, {
                name: `Amount ${ticker}`,
                alignRight: false,
              }, {
                name: `Total ${currency.toUpperCase()}`,
                alignRight: false,
              }, {
                name: '',
                alignRight: true,
                isRender: !(myOrders && myOrders.length > 0),
              },
            ]}
            className="table-sm"
            tableData={myOrders}
            emptyMessage="No open orders found."
            TableRowComponent={tableProps => {
              const pairRate = numberToLocaleString(bigIntFormat(bigIntDivision(tableProps.pairRate, ONE_GWEI)), {
                minimumFractionDigits: 9,
                maximumFractionDigits: 9,
              });
              const offerAmount = numberToLocaleString(bigIntFormat(bigIntDivision(tableProps.offerAmount, ONE_GWEI)), {
                minimumFractionDigits: 9,
                maximumFractionDigits: 9,
              });
              const total = numberToLocaleString(bigIntFormat(bigIntDecimalsDivision(bigIntMultiply(tableProps.pairRate, tableProps.offerAmount), 18)), {
                minimumFractionDigits: 9,
                maximumFractionDigits: 9,
              });
              
              return (
                <tr>
                  <td className={`${tableProps.type === 0 ? 'text-success' : 'text-danger'}`}>{pairRate}</td>
                  <td>{offerAmount}</td>
                  <td>{total}</td>
                  <td className="align-right">
                    <button
                      type="button"
                      className="btn btn-sm p-0 btn-icon"
                      onClick={() => handleCancel({
                        currency,
                        pairRate,
                        offerAmount,
                        total,
                        orderId: tableProps.id,
                      })}
                    >
                      <i className="zmdi zmdi-close" />
                    </button>
                  </td>
                </tr>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
