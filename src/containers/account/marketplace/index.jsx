/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import {BlockUpdater} from "containers/block-subscriber";
import {setBodyModalParamsAction} from "modules/modals";
import {getMarketplaceGeneralInfo} from 'modules/marketplace';
import SiteHeader from 'containers/components/site-header';
import MarketplaceDashboardHeader from './marketplace-dashboard-header';
import MarketplaceDashboardFooter from './marketplace-dashboard-footer';

import './MarketPLace.scss';

const Marketplace = () => {
    const dispatch = useDispatch();
    
    const handleCheckAcceptInfo = useCallback(() => {
        const isAcceptInfo = sessionStorage.getItem('accept-info');
        const modalParams = {
            title: 'Welcome to the Marketplace',
            modalText: [
            'Here you may find various goods and services at your disposal. In order to find what you need, you can search through them or use the tags of interest.',
            'You can further open a store to list your goods and services, receive feedback and give a discount. When using this functionality, please respect the privacy and dignity of other users.',
            'The decentralized nature of the blockchain allows listing of any inappropriate material. Please, make sure to comply with local legislation when using the Marketplace.'
            ],
            submitButtonName: 'Accept',
            onClick: () => sessionStorage.setItem('accept-info', true),
        };
        
        if (!isAcceptInfo) {
            dispatch(setBodyModalParamsAction('INFO-POPUP', modalParams));
        }
    }, [dispatch]);

    const updateData = useCallback(() => {
        dispatch(getMarketplaceGeneralInfo())
    }, [dispatch]);

    useEffect(() => {
        handleCheckAcceptInfo();
        BlockUpdater.on("data", updateData);
        return () => {
            BlockUpdater.removeListener("data",updateData)
        }
    }, [updateData, handleCheckAcceptInfo]);

    return (
        <div className="page-content">
            <SiteHeader
                pageTitle='Marketplace'
            />
            <div className="page-body container-fluid pl-0">
                <div className="marketplace">
                    <div className="row">
                        <MarketplaceDashboardHeader />
                        <MarketplaceDashboardFooter/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
