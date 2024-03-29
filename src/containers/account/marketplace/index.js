/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {BlockUpdater} from "../../block-subscriber";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getMarketplaceGeneralInfo} from '../../../modules/marketplace';
import SiteHeader from '../../components/site-header';

import MarketplaceDashboardHeader from './marketplace-dashboard-header';
import MarketplaceDashboardFooter from './marketplace-dashboard-footer';

import './MarketPLace.scss';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getMarketplaceGeneralInfo: () => dispatch(getMarketplaceGeneralInfo())
})

class Marketplace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            isShowMore: false
        };
    }

    componentDidMount() {
        this.handleCheckAcceptInfo();
    }
    
    handleCheckAcceptInfo = () => {
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
    }
        if (!isAcceptInfo) {
            this.props.setBodyModalParamsAction('INFO-POPUP', modalParams);
        }
    }

    componentWillMount() {
        BlockUpdater.on("data", this.updateData);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.updateData)
    }

    handleAcceptInfo = () => {
    }

    updateData = () => {
        this.props.getMarketplaceGeneralInfo()
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return true;
    }

    /*
    * Returns true if every element of array are equal
    * */

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Marketplace'}
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Marketplace);