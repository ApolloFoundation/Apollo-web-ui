import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import { useFormikContext } from 'formik';
import CustomInput from '../../custom-input';
import { getAssetAction } from '../../../../actions/assets';

export const AssetInput = ({ name }) => {
    const dispatch = useDispatch();
    const { values } = useFormikContext();
    const [asset, setAsset] = useState();

    const getAsset = useCallback(async () => {
        const asset = await dispatch(getAssetAction(values[name]));
        setAsset(asset);
    }, [dispatch, name, values[name]])

    useEffect(() => {
        getAsset();
    }, [getAsset])

    return (
        <div className="form-group row form-group-grey mb-15">
            <CustomInput
                name={name}
                placeholder="Asset"
                label="Asset ID"
            />
            <div className="input-group-append">
                <span className="input-group-text">Asset: {asset?.name ?? '-'}</span>
            </div>
        </div>
    );
}
