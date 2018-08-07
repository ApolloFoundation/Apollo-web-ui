import React from 'react';
import SiteHeader from '../../components/site-header';
import MarketplaceItem from './marketplace-card';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from "classnames";
import {getDGSGoodsAction,
        getDGSTagCountAction,
        getDGSPurchaseCountAction,
        getDGSGoodsCountAction,
        getDGSPurchasesAction,
        getDGSTagsAction,} from '../../../actions/marketplace'
import './MarketPLace.css';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getDGSGoodsAction: (reqParams) => dispatch(getDGSGoodsAction(reqParams)),
    getDGSTagCountAction: (reqParams) => dispatch(getDGSTagCountAction(reqParams)),
    getDGSPurchaseCountAction: (reqParams) => dispatch(getDGSPurchaseCountAction(reqParams)),
    getDGSGoodsCountAction: (reqParams) => dispatch(getDGSGoodsCountAction(reqParams)),
    getDGSPurchasesAction: (reqParams) => dispatch(getDGSPurchasesAction(reqParams)),
    getDGSTagsAction: (reqParams) => dispatch(getDGSTagsAction(reqParams)),
});

@connect(mapStateToProps, mapDispatchToProps)
class Marketplace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            isShowMore: false
        };
    }

    componentWillMount() {
        this.getInitialData({
            buyer: this.props.account
        });
        this.getDGSGoods({
            firstIndex: 0,
            lastIndex: 5,
            completed: true
        });
        this.getDGSTags({
            firstIndex: 0,
            lastIndex: 9,
            completed: true
        });
    }

    componentWillReceiveProps () {
        this.getInitialData({
            buyer: this.props.account
        });
        this.getDGSGoods({
            firstIndex: 0,
            lastIndex: 5,
            completed: true
        });
        this.getDGSTags({
            firstIndex: 0,
            lastIndex: 9,
            completed: true
        });
    }

    getInitialData = (reqParams) => {
        this.getDGSTagCount(reqParams);
        this.getDGSPurchaseCount(reqParams);
        this.getDGSGoodsCount(reqParams);
        this.getDGSPurchases(reqParams);
    }

    getDGSTagCount = async (reqParams) => {
        const getDGSTagCount = await this.props.getDGSTagCountAction(reqParams);
        if (getDGSTagCount) {
            this.setState({
                getDGSTagCount: getDGSTagCount.numberOfTags
            })
        }
    };

    getDGSPurchaseCount = async (reqParams) => {
        const getDGSPurchaseCount = await this.props.getDGSPurchaseCountAction(reqParams);
        if (getDGSPurchaseCount) {
            this.setState({
                getDGSPurchaseCount: getDGSPurchaseCount.numberOfPurchases
            })
        }
    };

    getDGSGoodsCount = async (reqParams) => {
        const getDGSGoodsCount = await this.props.getDGSGoodsCountAction(reqParams);
        if (getDGSGoodsCount) {
            this.setState({
                getDGSGoodsCount: getDGSGoodsCount.numberOfGoods
            })
        }
    };

    getDGSPurchases = async (reqParams) => {
        const getDGSPurchases = await this.props.getDGSPurchasesAction(reqParams);
        if (getDGSPurchases) {
            this.setState({
                getDGSPurchasesCount: getDGSPurchases.purchases.length,
                getDGSPurchases: getDGSPurchases.purchases.slice(0, 6)
            })
        }
    };

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            console.log(getDGSGoods.goods);
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    getDGSTags = async (reqParams) => {
        const getDGSTags = await this.props.getDGSTagsAction(reqParams);

        if (getDGSTags) {
            console.log(getDGSTags);
            this.setState({
                ...this.state,
                getDGSTags: getDGSTags.tags
            })
        }
    };

    showMoreController = () => {
        this.setState({
            ...this.state,
            isShowMore: !this.state.isShowMore
        }, () => {
            if (this.state.isShowMore){
                this.setState({
                    page: 1,
                    firstIndex: 0,
                    lastIndex: 31
                })
                this.getDGSTags({
                    firstIndex: 0,
                    lastIndex: 31
                })
            } else {
                this.setState({
                    page: 1,
                    firstIndex: 0,
                    lastIndex: 9
                })
                this.getDGSTags({
                    firstIndex: 0,
                    lastIndex: 9
                })
            }
        });
    };

    onPaginate = (page) => {
        let reqParams = {
            page: page,
            firstIndex: page * 32 - 32,
            lastIndex:  page * 32 - 1
        };

        this.setState({...this.state,...reqParams}, () => {
            this.getDGSTags(reqParams)
        });
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Marketplace'}
                />
                <div className="page-body container-fluid">
                    <div className="marketplace">
                        <div className="row">
                            <div className={classNames({
                                'col-md-6' : !this.state.isShowMore,
                                'col-md-3' : this.state.isShowMore
                            })}>
                                <div className="card fll-height marketplace product-box">

                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card fll-height header ballance">
                                    <div className="full-box full">
                                        <div className="full-box-item direction-row">
                                            <span className="card-title align-left">Purchased products</span>
                                            <span className="card-title align-right">{this.state.getDGSPurchasesCount}</span>
                                        </div>
                                        <div className="full-box-item direction-row">
                                            <p className="card-title align-left">Products available</p>
                                            <p className="card-title align-right">{this.state.getDGSGoodsCount}</p>
                                        </div>
                                        <div className="full-box-item direction-row">
                                            <p className="card-title align-left">Total purchases</p>
                                            <p className="card-title align-right">{this.state.getDGSPurchaseCount}</p>
                                        </div>
                                        <div className="full-box-item direction-row">
                                            <p className="card-title  align-left">Total tags</p>
                                            <p className="card-title  align-right">{this.state.getDGSTagCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={classNames({
                                'col-md-3' : !this.state.isShowMore,
                                'col-md-6' : this.state.isShowMore
                            })}>
                                <div className="card  marketplace filters transparent">
                                    <div className="search-bar">
                                        <div className="row">
                                            <div className={classNames({
                                                'col-md-12' : !this.state.isShowMore,
                                                'col-md-6' : this.state.isShowMore
                                            })}>
                                                <div className="input-group search tabled">
                                                    <input type="text"/>
                                                    <div className="input-icon">
                                                        <i className="zmdi zmdi-search"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={classNames({
                                                'col-md-12' : !this.state.isShowMore,
                                                'col-md-6' : this.state.isShowMore
                                            })}>
                                                <div className="input-group search tabled">
                                                    <input type="text"/>
                                                    <div className="input-icon">
                                                        <i className="zmdi zmdi-search"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filters-bar">
                                        {
                                            this.state.getDGSTags &&
                                            this.state.getDGSTags.map((el, index) => {
                                                return (
                                                    <Link to={'/marketplace/' + el.tag} className="btn primary">{el.tag}&nbsp;[{el.totalCount}]</Link>
                                                );
                                            })
                                        }
                                        <a onClick={this.showMoreController} className="btn primary blue" dangerouslySetInnerHTML={{__html: this.state.isShowMore ? 'View less' : 'View more'}}/>
                                        {
                                            this.state.getDGSTags && this.state.isShowMore &&
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
                                                        'disabled' : this.state.getDGSTags.length < 32
                                                    })}
                                                >Next</a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                this.state.getDGSGoods &&
                                <div className="form-group transparent marketplace no-padding-bottom">
                                    <div className="form-title padding-left offset-bottom">
                                        <p>
                                            Recent listings&nbsp;&nbsp;
                                            <Link to="/recent-listing" className="btn primary static">View more</Link>
                                        </p>
                                    </div>
                                    <div className="row">
                                        {
                                            this.state.getDGSGoods.map((el, index) => {
                                                return (
                                                    <div className="col-md-2">
                                                        <MarketplaceItem
                                                            fullHeight
                                                            {...el}
                                                        />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            {
                                this.state.getDGSPurchases &&
                                <div className="form-group transparent marketplace no-padding-bottom">
                                    <div className="form-title padding-left offset-bottom">
                                        <p>
                                            Recent purchases&nbsp;&nbsp;
                                            <a className="btn primary static">View more</a>
                                        </p>
                                    </div>
                                    <div className="row">
                                        {
                                            this.state.getDGSPurchases.map((el, index) => {
                                                return (
                                                    <div className="col-md-2">
                                                        <MarketplaceItem
                                                            fullHeight
                                                            {...el}
                                                        />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Marketplace;