/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {getDGSGoodAction} from "actions/marketplace";
import classNames from 'classnames';
import config from 'config';
import TextualInput from "containers/components/form-components/TextualInput";
import ModalBody from 'containers/components/modals/modal-body';
import { getDecimalsSelector, getModalDataSelector, getTickerSelector } from 'selectors';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';

const MarketplaceProductDetails = ({ closeModal }) => {
    const dispatch = useDispatch();
    const [goods, setGoods] = useState(null);
    const modalData = useSelector(getModalDataSelector, shallowEqual);
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

    useEffect(() => {
        handleImageLoadint();
    }, [handleImageLoadint]);

    return (
        <ModalBody closeModal={closeModal}>
            {goods && (
                <div className="right-bar">
                    <div className="form-title">
                        <p>{goods.name}</p>
                    </div>
                    <div className="form-group mb-15">
                        <div className="top-bar">
                            <div
                                style={{
                                    backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + goods.goods + '&retrieve=true)'
                                }}
                                className={classNames({
                                    "marketplace-image": true,
                                    "no-image": !goods.hasImage
                                })}
                            />
                        </div>
                    </div>
                    <div className="form-group mb-15">
                        <label>
                            Price:
                        </label>
                        <div className="price">
                            {goods.priceATM / decimals} {ticker}
                        </div>
                    </div>
                    {goods.description && (
                        <div className="form-group mb-15">
                            <label>
                                Description:
                            </label>
                            <div>
                                {goods.description}
                            </div>
                        </div>
                    )}
                    <TextualInput
                        label="Date:"
                        text={format(goods.timestamp)}
                    />
                    <TextualInput
                        label="Seller:"
                        text={goods.sellerRS}
                    />
                    <TextualInput
                        label="Quantity:"
                        text={`${goods.quantity}`}
                    />
                </div>
            )}
        </ModalBody>
    );
};

export default MarketplaceProductDetails;
