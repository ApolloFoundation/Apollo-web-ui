/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import classNames from "classnames";
import uuid from "uuid";
import MyAssetItem from './my-asset-item';
import {getSpecificAccountAssetsAction} from "../../../actions/assets";
import {BlockUpdater} from "../../block-subscriber/index";
import InfoBox from '../../components/info-box';
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';

const mapStateToProps = state => ({
    assetBalances: state.account.assetBalances,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams))
});

class MyAssets extends React.Component {
    state = {
        assets: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
    };

    onPaginate = (page) => {
        const pagination = {
            page: page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };

        this.getAssets(pagination);
    };


    componentDidMount() {
        this.getAssets();
        BlockUpdater.on("data", data => {
            this.getAssets();
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    getAssets = async (pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex,
            }
        }
        let assets = await this.props.getAssetAction({
            account: this.props.account,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex,
        });

        if (assets) {
            const accountAssets = assets.accountAssets;
            const assetsInfo    = assets.assets;

            const result = assetsInfo.map((el, index) => {
                return {
                    ...el,
                    unconfirmedQuantityATU: accountAssets[index].unconfirmedQuantityATU
                }
            });

            this.setState({
                ...pagination,
                assets: result,
            })
        }
    };

    getTransaction = async (data) => {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My assets'}
                />
                <div className="page-body container-fluid">
                    <CustomTable 
                        header={[
                            {
                                name: 'Asset',
                                alignRight: false
                            },{
                                name: 'Quantity',
                                alignRight: true
                            },{
                                name: 'Total Available',
                                alignRight: true
                            },{
                                name: 'Percentage',
                                alignRight: true
                            },{
                                name: 'Lowest Ask',
                                alignRight: true
                            },{
                                name: 'Highest Bid',
                                alignRight: true
                            },{
                                name: 'Value in Coin',
                                alignRight: true
                            },{
                                name: 'Action',
                                alignRight: true
                            }
                        ]}
                        TableRowComponent={MyAssetItem}
                        tableData={this.state.assets}
                        className={'mb-3'}
                        isPaginate
                        page={this.state.page}
                        emptyMessage={'No assets found.'}
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAssets);