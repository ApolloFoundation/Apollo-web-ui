import React from 'react';

export const InfoCurrency = ({ modalData, }) => (
  <>
    <div className="form-group mb-15">
      <label>
        Reserve supply
      </label>
      <div>
        <span>{modalData.reserveSupply / (10 ** modalData.decimals)}</span>
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Initial supply included
      </label>
      <div>
        <span>
          {modalData.initialSupply / (10 ** modalData.decimals)}
        </span>
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Target reserve
      </label>
      <div>
        <span>
          {modalData.minReservePerUnitATM / (10 ** modalData.decimals)}
        </span>
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Current reserve
      </label>
      <div>
        <span>
          {modalData.currentReservePerUnitATM / (10 ** modalData.decimals)}
        </span>
      </div>
    </div>
  </>
);