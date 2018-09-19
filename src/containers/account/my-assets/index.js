import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import classNames from "classnames";
import uuid from "uuid";
import MyAssetItem from './my-asset-item';
import {getSpecificAccountAssetsAction} from "../../../actions/assets";
import {BlockUpdater} from "../../block-subscriber/index";


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
        if (this.props.assetBalances) {
            let assets = await this.props.getAssetAction({
                account: this.props.account
            });

            console.log(assets);

            if (assets) {
                const accountAssets = assets.accountAssets;
                const assetsInfo    = assets.assets;


                const result = accountAssets.map((el, index) => {
                    return {...(assetsInfo[index]), ...el}
                });

                this.setState({
                    assets: result,
                })
            }

            // Promise.all(assets)
            //     .then((data) => {
            //
            //
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     })
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
                                        > Previous</a>
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
                                        >Next</a>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAssets);