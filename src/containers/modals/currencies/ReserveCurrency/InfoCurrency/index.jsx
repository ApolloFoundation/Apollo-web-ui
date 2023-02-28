import React from 'react';
import { bigIntDecimalsDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

export const InfoCurrency = ({ modalData, }) => (
  <>
    <div className="form-group mb-15">
      <label>
        Reserve supply
      </label>
      <div>
        <span>{bigIntFormat(bigIntDecimalsDivision(modalData.reserveSupply, modalData.decimals))}</span>
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Initial supply included
      </label>
      <div>
        <span>
          {bigIntFormat(bigIntDecimalsDivision(modalData.initialSupply, modalData.decimals))}
        </span>
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Target reserve
      </label>
      <div>
        <span>
          {bigIntFormat(bigIntDecimalsDivision(modalData.minReservePerUnitATM, modalData.decimals))}
        </span>
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Current reserve
      </label>
      <div>
        <span>
          {bigIntFormat(bigIntDecimalsDivision(modalData.currentReservePerUnitATM, modalData.decimals))}
        </span>
      </div>
    </div>
  </>
);