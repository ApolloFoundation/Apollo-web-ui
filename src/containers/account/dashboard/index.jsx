/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SiteHeader from '../../components/site-header';
import { setBodyModalParamsAction } from '../../../modules/modals';

import TotalBalance from './TotalBalance';
import MyTransactions from './MyTransactions';
import BlockchainStatus from './BlockchainStatus';
import SendApollo from './SendApollo';
import StayInTouch from './StayInTouch';
import ActivePolls from './ActivePolls';
import InfoStatistic from './InfoStatistic';

import TwitterBanner from '../../../assets/banner-small.png';
import InfoBanner from '../../../assets/banner-long.png';


export default function Dashboard(props) {
  const dispatch = useDispatch();

  const { isShareMessage, shareMessageTransaction } = props;

  useEffect(() => {
    if (isShareMessage) {
      setTimeout(() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', shareMessageTransaction), 500));
    }
  }, [dispatch, isShareMessage, shareMessageTransaction]);

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
                      href="https://medium.com/@apollocurrency"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card card-square card-xl"
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
                        href="https://twitter.com/ApolloCurrency"
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
