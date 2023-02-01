import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import { useFormikContext } from 'formik';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import { getAssetAction } from 'actions/assets';

export const AssetInput = ({ name }) => {
    const dispatch = useDispatch();
    const { values } = useFormikContext();
    const [asset, setAsset] = useState();

    const getAsset = useCallback(async () => {
        const res = await dispatch(getAssetAction({ asset: values[name] }));
        setAsset(res);
    }, [dispatch, name, values[name]])

    useEffect(() => {
        getAsset();
    }, [getAsset])

    return (
        <CustomInput
            name={name}
            placeholder="Asset"
            label="Asset ID"
        >
            <div className="input-group-append">
                <span className="input-group-text">Asset: {asset?.name ?? '-'}</span>
            </div>
        </CustomInput>
    );
}
