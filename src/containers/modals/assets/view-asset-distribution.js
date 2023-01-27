/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {setBodyModalParamsAction} from 'modules/modals';
import {getAccountAssetsAction} from "actions/assets";
import { useDataLoader } from 'hooks/useDataLoader';
import { getModalDataSelector } from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';

const AssetDistribution = (props) => {
    const dispatch = useDispatch();
    const modalData = useSelector(getModalDataSelector, shallowEqual);
    
    const handleLoadData = useCallback(async () => {
        const res = await dispatch(getAccountAssetsAction({
            requestType: 'getAssetAccounts',
            asset: modalData.asset
        }));
        return res?.accountAssets ?? [];
    }, [dispatch, modalData.asset]);

    const handleOpenModal = (account) => () => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account));

    const { data } = useDataLoader(handleLoadData);

    return (
        <ModalBody
            modalTitle="Asset Distribution"
            closeModal={props.closeModal}
            isDisableFormFooter
        >
                <div className="transaction-table no-min-height">
                    <div className="transaction-table-body transparent padding-vertical-padding">

                        <table>
                            <thead>
                            <tr>
                                <td>Account</td>
                                <td>Quantity</td>
                                <td className="align-right">Percentage</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data?.map((el) => (
                                    <tr key={el.accountRS}>
                                        <td className='blue-link-text'>
                                            <span
                                                className='blue-link-text'
                                                onClick={handleOpenModal(el.account)}>
                                                {el.accountRS}
                                            </span>
                                        </td>
                                        <td>{el.quantityATU / Math.pow(10, modalData.decimals)}</td>
                                        <td className="align-right">{(el.quantityATU / modalData.totalAvailable) * 100} %</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
        </ModalBody>
    );
}

export default AssetDistribution;
