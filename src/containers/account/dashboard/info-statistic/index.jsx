import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardInfoSelector } from '../../../../selectors';

const InfoStatistic = () => {
  const {
    dashboardMessagesCount, dashboardActiveSuffling, dashboardAliasesCount, dashboardTaggedData,
  } = useSelector(getDashboardInfoSelector, shallowEqual);

  return (
    <div className="card card-primary-items card-h-195">
      <div className="general-info h-100">
        <Link
          to="/messenger"
          className="general-info-item top-left"
        >
          <div className="top-bar">
            {dashboardMessagesCount === '100' ? '100+' : dashboardMessagesCount}
          </div>
          <div>
            Secure
            <br />
            messages
          </div>
        </Link>
        <Link
          to="/active-shuffling"
          className="general-info-item top-right"
        >
          <div className="top-bar">
            {dashboardActiveSuffling}
          </div>
          <div>
            Coin
            <br />
            shuffling
          </div>
        </Link>
        <Link
          to="/aliases"
          className="general-info-item bottom-left"
        >
          <div className="top-bar">
            {dashboardAliasesCount}
          </div>
          <div>
            Secure
            <br />
            Aliases
          </div>
        </Link>
        <Link
          to="/data-storage"
          className="general-info-item bottom-right"
        >
          <div className="top-bar">
            {dashboardTaggedData}
          </div>
          <div>
            Data
            <br />
            storage
          </div>
        </Link>
      </div>
    </div>
  );
};

export default InfoStatistic;
