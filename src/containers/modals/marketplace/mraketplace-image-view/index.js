/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import classNames from 'classnames';
import  {getDGSGoodAction} from "../../../../actions/marketplace";
import config from '../../../../config'
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector } from '../../../../selectors';

const MarketplaceImage = (props) => {
    const dispatch = useDispatch();
    const [goods, setGoods] = useState(null);
    const modalData = useSelector(getModalDataSelector, shallowEqual);

    const handleImageLoadint = useCallback(async () => {
        const productData = await dispatch(getDGSGoodAction({
            goods: modalData
        }));
        if (productData) {
            setGoods(productData)
        }
    }, [modalData]);

    useEffect(() => {
        handleImageLoadint()
    }, [handleImageLoadint]);

    return (
        <ModalBody
            isDisableFormFooter
            modalTitle={goods?.name}
            closeModal={props.closeModal}
        >
            {
                goods &&
                    <div
                        style={{
                            height: 400,
                            backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + goods.goods + '&retrieve=true)'
                        }}
                        className={classNames({
                            "marketplace-image": true,
                            "no-image": !goods.hasImage
                        })}
                    />
            }
        </ModalBody>
    );
}

export default MarketplaceImage;
