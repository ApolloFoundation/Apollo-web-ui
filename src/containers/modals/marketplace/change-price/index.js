/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NotificationManager} from "react-notifications";
import  {getDGSGoodAction} from "../../../../actions/marketplace";
import config from '../../../../config';
import ModalBody from '../../../components/modals/modal-body';
import {
    getAccountRsSelector,
    getDecimalsSelector,
    getModalDataSelector,
    getTickerSelector
} from '../../../../selectors';
import { useFormatTimestamp } from '../../../../hooks/useFormatTimestamp';
import Form from './form';

const MarketplaceChangePrice = ({ closeModal, processForm }) => {
    const dispatch = useDispatch();
    const [goods, setGoods] = useState(null);
    const modalData = useSelector(getModalDataSelector);
    const account = useSelector(getAccountRsSelector);
    const decimals = useSelector(getDecimalsSelector);
    const ticker = useSelector(getTickerSelector);
    const format = useFormatTimestamp();

    const handleImageLoadint = useCallback(async () => {
        const productData = await dispatch(getDGSGoodAction({
            goods: modalData
        }));

        if (productData) {
            setGoods(productData);
        }
    }, [dispatch, modalData]);

    const handleFormSubmit = useCallback(async (values) => {
        const data = {
            ...values,
            priceATM: parseInt(values.priceATM),
            goods: goods.goods,
            recipient: account,
        };

        processForm(data, 'dgsPriceChange', 'The marketplace item\'s price has been changed successfully!', () => {
            closeModal();
            NotificationManager.success('The marketplace item\'s price has been changed successfully!', null, 5000);
        })
    }, [processForm, closeModal, goods, account]);

    useEffect(() => {
        handleImageLoadint();
    }, [handleImageLoadint]);

    return (
        <ModalBody
            handleFormSubmit={handleFormSubmit}
            closeModal={closeModal}
            isAdvanced
            isFee
            marketplace={{
                priceATM: goods ? goods.priceATM : null,
                name: goods ? goods.name : null,
                hasImage: goods ? goods.hasImage : null,
                image:  `${config.api.serverUrl}requestType=downloadPrunableMessage&transaction=${goods ? goods.goods : null}&retrieve=true`,
                description: goods ? goods.description : null
            }}
            submitButtonName="Change price"
            initialValues={{
                priceATM: 1,
            }}
        >
            <Form
                goods={goods}
                formatTimestamp={format}
                ticker={ticker}
                decimals={decimals}
            />
        </ModalBody>
    );
}

export default MarketplaceChangePrice;
