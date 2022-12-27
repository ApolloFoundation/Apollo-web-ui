import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import { TextComponentWithIcon } from '../TextComponent';
import { getAssetAction } from '../../../../actions/assets';

export const AssetInput = ({
  field,
  name,
}) => {
  const dispatch = useDispatch();
  const [asset, setAsset] = useState();

  const getAsset = useCallback(async () => {
      const asset = await dispatch(getAssetAction({ asset: field.value }));
      setAsset(asset);
  }, [dispatch, field.value])

  useEffect(() => {
      getAsset();
  }, [getAsset]);

  return (
    <TextComponentWithIcon
      name={name}
      field={field}
      placeholder="Asset"
      label="Asset ID"
      icon={
        <span className="input-group-text">Asset: {asset?.name ?? '-'}</span>
      }
    />
  );
}
