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


const mapStateToProps = state => ({
    assetBalances: state.account.assetBalances,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams))
});

class MyAssets extends React.Component {
    constructor(props) {
        super(props);

        this.getTransaction = this.getTransaction.bind(this);
        this.getAssets      = this.getAssets.bind(this);
    }

    state = {
        assets: null,
        page: 1,
        firstIndex: 0,
        lastIndex: 14,
    };

    onPaginate = (page) => {
        let reqParams = {
            ...this.props,
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };

        this.setState(reqParams, () => {
            this.getAssets(reqParams)
        });
    };


    componentDidMount() {
        this.getAssets();
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getAssets();
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps() {
        this.getAssets();
    }

    async getAssets() {
        let assets = await this.props.getAssetAction({
            account: this.props.account
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
                assets: result,
            })
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My assets'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <ContentHendler
                            items={this.state.assets}
                            emptyMessage={'No assets found.'}
                        >
                            {
                                !!this.state.assets &&
                                !!this.state.assets.length &&
                                <div className="transaction-table">
                                    <div className="transaction-table-body">
                                        <table>
                                            <thead>
                                            <tr>
                                                <td>Asset</td>
                                                <td className="align-right">Quantity</td>
                                                <td className="align-right">Total Available</td>
                                                <td className="align-right">Percentage</td>
                                                <td className="align-right">Lowest Ask</td>
                                                <td className="align-right">Highest Bid</td>
                                                <td className="align-right">Value in Coin</td>
                                                <td className="align-right">Action</td>
                                            </tr>
                                            </thead>
                                            <tbody key={uuid()}>
                                            {
                                                this.state.assets &&
                                                this.state.assets.map((el, index) => {
                                                    return (
                                                        <MyAssetItem
                                                            key={uuid()}
                                                            transfer={el}
                                                            setTransaction={this.getTransaction}
                                                        />
                                                    );
                                                })
                                            }
                                            </tbody>
                                        </table>
                                        {
                                            this.state.trades &&
                                            <div className="btn-box">
                                                <a
                                                    className={classNames({
                                                        'btn' : true,
                                                        'btn-left' : true,
                                                        'disabled' : this.state.page <= 1
                                                    })}
                                                    onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                                >
                                                    Previous
                                                </a>
                                                <div className='pagination-nav'>
                                                    <span>{this.state.firstIndex + 1}</span>
                                                    <span>&hellip;</span>
                                                    <span>{this.state.lastIndex + 1}</span>
                                                </div>
                                                <a
                                                    onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                                    className={classNames({
                                                        'btn' : true,
                                                        'btn-right' : true,
                                                        'disabled' : this.state.trades.length < 15
                                                    })}
                                                >
                                                    Next
                                                </a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                        </ContentHendler>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAssets);