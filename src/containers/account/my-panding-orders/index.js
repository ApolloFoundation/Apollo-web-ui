/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import SiteHeader from '../../components/site-header'
import InfoBox from "../../components/info-box"
import { getDGSGoodsAction } from "../../../actions/marketplace";
import { BlockUpdater } from "../../block-subscriber/index";
import MarketplaceColumnTable from '../../components/marketplace-column-table/';
import { getAccountSelector, getModalDataSelector } from '../../../selectors';

class MyProductsForSale extends React.Component {
    state = {
        page: 1,
        firstIndex: 0,
        lastIndex: 7,
        getDGSGoods: null
    };

    componentDidMount() {
        this.getDGSGoods({
            requestType: 'getDGSPendingPurchases',
            includeCounts: true,
            seller: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", data => {
            this.updateDgsGoods();
        });
    }

    updateDgsGoods = () => {
        this.getDGSGoods({
            requestType: 'getDGSPendingPurchases',
            seller: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    onPaginate(page) {
        let reqParams = {
            page: page,
            requestType: 'getDGSPendingPurchases',
            account: this.props.account,
            firstIndex: page * 8 - 8,
            lastIndex: page * 8 - 1
        };

        this.setState(reqParams, () => {
            this.getDGSGoods(reqParams)
        });
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                getDGSGoods: getDGSGoods.purchases
            })
        }
    };

    render() {
        const { getDGSGoods } = this.state;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My pending orders'}
                />
                <div className="page-body container-fluid full-screen-block">
                    <div className={'marketplace'}>
                        <div className={'row'}>
                        {this.state.getDGSGoods && this.state.getDGSGoods.length ? (
                            <MarketplaceColumnTable
                                data={getDGSGoods}
                                page={this.state.page}
                                deliver
                            />
                        ) : (
                            <InfoBox default>
                                No orders found.
                            </InfoBox>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: getAccountSelector(state),
    modalData: getModalDataSelector(state),
});

const initMapDispatchToProps = {
    getDGSGoodsAction
};

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(MyProductsForSale);
