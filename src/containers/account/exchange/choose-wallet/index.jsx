import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';
import { getCurrencyBalance } from 'actions/wallet';
import { setCurrentCurrencyAction } from 'modules/exchange';
import getFullNumber from 'helpers/util/expancionalParser';
import SiteHeader from 'containers/components/site-header';
import CustomTable from 'containers/components/tables/table1';
import InfoBox from 'containers/components/info-box';
import { useExchangeWalletConverts } from 'hooks/useExchangeWalletConverts';
import { readFromLocalStorage } from 'actions/localStorage';
import { getAccountInfoSelector } from 'selectors';
import CurrencyDescriptionComponent from './currency';

export default function ChooseWallet() {
  const dispatch = useDispatch();
  const { converWallets } = useExchangeWalletConverts();

  const { wallets } = useSelector(getAccountInfoSelector, shallowEqual);

  const [dataWallets, setDataWallets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrencyBalance = useCallback(async currWallets => {
    setIsLoading(true);

    const params = converWallets(currWallets);

    const walletsBalances = await dispatch(getCurrencyBalance(params));

    if (walletsBalances) {
      setDataWallets(walletsBalances);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [dispatch, converWallets]);

  const handleCurrentCurrency = useCallback(currency => {
    dispatch(setCurrentCurrencyAction(currency));
  }, [dispatch]);


  useEffect(() => {
    const localWallets = readFromLocalStorage('wallets');

    if (!localWallets) {
      setBodyModalParamsAction('LOGIN_EXCHANGE', {});
    } else {
      handleGetCurrencyBalance(JSON.parse(localWallets));
    }
  }, []);

  useEffect(() => {
    if (!dataWallets && wallets && !isLoading) {
      handleGetCurrencyBalance(wallets);
    }
  }, [dataWallets, handleGetCurrencyBalance, isLoading, wallets]);

  const renderContent = useMemo(() => {
    if (dataWallets) {
      return (
        <div className="card-block primary form-group-app p-0 mb-3">
          <div className="form-title form-title-lg d-flex flex-column justify-content-between">
            <p className="title-lg">My Wallets</p>
          </div>
          {Object.keys(dataWallets).map((currency, i) => (
            <CustomTable
              key={i}
              header={[
                {
                  name: 'Wallets',
                  alignRight: false,
                }, {
                  name: 'Amount ETH',
                  alignRight: false,
                }, {
                  name: 'Amount PAX',
                  alignRight: false,
                }, {
                  name: 'Buy',
                  alignRight: false,
                }, {
                  name: 'Sell',
                  alignRight: false,
                }, {
                  name: 'Transactions history',
                  alignRight: false,
                }, {
                  name: 'Actions',
                  alignRight: true,
                },
              ]}
              className="pt-0 no-min-height no-padding rounded-top"
              tableData={dataWallets[currency].map(dataWallet => ({
                ...dataWallet,
                balances: {
                  ...dataWallet.balances,
                  pax: getFullNumber(Number(dataWallet.balances.pax)),
                  eth: getFullNumber(Number(dataWallet.balances.eth)),
                },
              }))}
              passProps={{ currency, handleCurrentCurrency }}
              emptyMessage="No wallet info found."
              TableRowComponent={CurrencyDescriptionComponent}
            />
          ))}
        </div>
      );
    }

    return (
      <div>
        <InfoBox default>
          You have no Wallet at the moment.&nbsp;
          <span className="blue-link-text" onClick={() => dispatch(setBodyModalParamsAction('LOGIN_EXCHANGE', {}))}>
            Log in
          </span>
        </InfoBox>
      </div>
    );
  }, [dataWallets, dispatch, handleCurrentCurrency]);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Wallets"
      />
      <div className="exchange page-body container-fluid pl-3">
        {!isLoading
          ? renderContent
          : (
            <div className="align-items-center loader-box">
              <div className="ball-pulse">
                <div />
                <div />
                <div />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
