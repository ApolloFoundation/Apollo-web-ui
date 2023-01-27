/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';
import { getDashboardData } from 'actions/dashboard';
import SiteHeader from '../../components/site-header';
import TwitterBanner from "assets/dashboard-safe.jpeg";
import InfoBanner from "assets/dashboard-Invest-APL.jpg";
import { getAccountSelector, getActualBlockSelector } from 'selectors';
import TotalBalance from './total-balance';
import MyTransactions from './my-transactions';
import BlockchainStatus from './blockchain-status';
import SendApollo from './send-apollo';
import StayInTouch from './stay-in-touch';
import ActivePolls from './active-polls';
import InfoStatistic from './info-statistic';

export default function Dashboard({ isShareMessage, shareMessageTransaction }) {
  const dispatch = useDispatch();

  const actualBlock = useSelector(getActualBlockSelector);
  const account = useSelector(getAccountSelector);

  useEffect(() => {
    if (isShareMessage) {
      setTimeout(() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', shareMessageTransaction), 500));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch, actualBlock, account]);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Dashboard"
        dashboardPage
      />
      <div className="page-body dashboard">
        <div className="container-fluid p-0">
          <div className="cards-wrap row">
            <div className="col-lg-3 col-md-4 col-sm-12 p-0">
              <div className="d-flex flex-column">
                <TotalBalance />
                <MyTransactions />
              </div>
            </div>
            <div className="col-lg-9 col-md-8 col-sm-12 p-0">
              <div className="row">
                <div className="col-lg-8 p-0">
                  <div className="row">
                    <div className="col-sm-6 p-0">
                      <div className="d-flex flex-column">
                        <BlockchainStatus />
                        <ActivePolls />
                      </div>
                    </div>
                    <div className="col-sm-6 p-0 d-flex">
                      <SendApollo />
                    </div>
                  </div>
                  <div className="wrap-card-square-xl">
                    <a
                      href="https://instantinvest.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card card-square card-xl dashboard-tooltip-card"
                      style={{ backgroundImage: `url(${InfoBanner})` }}
                    />
                  </div>
                </div>
                <div className="col-lg-4 p-0">
                  <div className="d-flex flex-column">
                    <InfoStatistic />
                    <StayInTouch />
                    <div className="wrap-card-square">
                      <a
                        href="https://twitter.com/aplfintech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card card-square"
                        style={{ backgroundImage: `url(${TwitterBanner})` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
