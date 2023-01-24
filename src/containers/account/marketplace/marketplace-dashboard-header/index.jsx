import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { getMarketplaceGeneralInfo } from '../../../../modules/marketplace';
import MarketplaceGeneral from '../marketplace-general';
import MarketplaceTags from '../marketplace-tags/index';

const MarketplaceDashboardHeader = () => {
  const dispatch = useDispatch();  
  const [isShowMore, setIsShowMore] = useState();
  useEffect(() => {
    dispatch(getMarketplaceGeneralInfo());
  }, [])

  const showMoreController = () => {
    setIsShowMore(prevState => !prevState);
  };

  return (
    <>
      <div className={classNames({
        'col-md-12 col-lg-6 marketplace-preview-item': !isShowMore,
        'col-md-3': isShowMore,
        'pl-0': true,
        'pr-0': true,
        'pb-3': true,
      })}
      >
        <div className="card fll-height marketplace product-box" />
      </div>
      <div className="col-md-6 col-lg-3 marketplace-preview-item pl-3 pr-0 pb-3">
        <MarketplaceGeneral />
      </div>
      <div className={classNames({
        'col-md-6  col-lg-3 marketplace-preview-item': !isShowMore,
        'col-md-6': isShowMore,
        'pb-3': true,
        'pl-3': true,
        'pr-0': true,
      })}
      >
        <MarketplaceTags
          isShowMore={isShowMore}
          showMoreController={showMoreController}
        />
      </div>
    </>
  );
}

export default MarketplaceDashboardHeader;
