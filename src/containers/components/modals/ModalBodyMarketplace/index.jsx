import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getDecimalsSelector, getTickerSelector } from 'selectors';

export const ModalBodyMarketplace = ({
  marketplace,
  openPrevModal,
  modalsHistory,
  isDisabledBackArrow
}) => {
  const decimals = useSelector(getDecimalsSelector);
  const ticker = useSelector(getTickerSelector);

  if (!marketplace) return null;

  return (
    <>
      {marketplace.name && (
          <div className="form-title">
              {
                  !isDisabledBackArrow &&
                  modalsHistory.length > 1 &&
                  <div className="backMy" onClick={openPrevModal} />
              }
              <p>{marketplace.name}</p>
          </div>
      )}
      <div className="form-group mb-15">
          <div className="top-bar">
              <div
                  style={{
                      backgroundImage: `url(${marketplace.image})`
                  }}
                  className={classNames('marketplace-image', {
                      "no-image": !marketplace.hasImage
                  })}
              />
          </div>
      </div>
      <div className="form-group mb-15">
          <label>
              Price:
          </label>
          <div className="price">
              {marketplace.priceATM / decimals} {ticker}
          </div>
      </div>
  
      {marketplace.description && (
          <div className="form-group mb-15">
              <label>
                  Description:
              </label>
              <div>
                  {marketplace.description}
              </div>
          </div>
      )}
    </>
  );
}
