import React from 'react';
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";

export const AssetDescription = ({ asset }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const handleModal = () =>
  dispatch(setBodyModalParamsAction('VIEW_ASSET_DISTRIBUTION', {
        asset: params.asset,
        decimals: asset.decimals,
        totalAvailable: asset.quantityATU
    }))
  
  return (
    <div className="card mb-3">
      <div className="card-title card-title-lg bg-primary">
          <span className='title-lg'>{asset.name}</span>
      </div>
      <div className="card-body">
          <div className='form-group-app'>
              <div className='wrap-info'>
                  <p className='mb-3'>
                      <label>
                          Total available:
                      </label>
                      <div>
                          {(asset.quantityATU / Math.pow(10, asset.decimals)).toFixed(asset.decimals)} {asset.name}
                      </div>
                  </p>
                  <p className='mb-3'>
                      <label>
                          Description:
                      </label>
                      <div>
                          {asset.description}
                      </div>
                  </p>
                  <p className='mb-3'>
                      <label>
                          Account:
                      </label>
                      <div>
                          {asset.accountRS}
                      </div>
                  </p>
                  <p className='mb-3'>
                      <label>
                          Asset ID:
                      </label>
                      <div>
                          {asset.asset}
                      </div>
                  </p>
                  <p>
                    <label>
                      Asset decimals: 
                    </label>
                    <div>
                      {asset.decimals}
                    </div>
                  </p>
              </div>
              <button
                  type='button'
                  className="btn btn-default btn-lg"
                  onClick={handleModal}
              >
                  View Asset Distribution
              </button>
          </div>
      </div>
    </div>
  );
}