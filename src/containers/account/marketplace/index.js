import React from 'react';
import SiteHeader from '../../components/site-header';
import MarketplaceItem from './marketplace-card';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from "classnames";
import InputMask from 'react-input-mask';
import {Form, Text} from 'react-form';
import {getDGSGoodsAction,
        getDGSTagCountAction,
        getDGSPurchaseCountAction,
        getDGSGoodsCountAction,
        getDGSPurchasesAction,
        getDGSTagsAction,} from '../../../actions/marketplace'
import './MarketPLace.css';
import uuid from "uuid";

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

    componentWillReceiveProps (newState) {
        this.getInitialData({
            buyer: newState.account
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
        delete reqParams.buyer;

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
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    getDGSTags = async (reqParams) => {
        const getDGSTags = await this.props.getDGSTagsAction(reqParams);

        if (getDGSTags) {
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
    };

    handleChange = (event) => {
        if (event.target) {
            var value = event.target.value;
            var newState = {
                mask: 'APL-****-****-****-*****',
                value: value.toUpperCase()
            };

            if (/^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(value)) {
                newState.value = 'APL-****-****-****-*****';
            }
            this.setState(newState);
        }
    };

    handleSearchByTag = (values) => {
        if (values.tag) {
            this.props.history.push('/marketplace/' + values.tag)
        }
    };

    handleSearchByAccount = (values) => {
        if (values) {
            this.props.history.push('/marketplace/' + values.seller)
        }
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Marketplace'}
                />
                <div className="page-body container-fluid">
                    <div className="marketplace marketplace-preview">
                        <div className="row">
                            <div className={classNames({
                                'col-md-12 col-lg-6 marketplace-preview-item' : !this.state.isShowMore,
                                'col-md-3' : this.state.isShowMore
                            })}>
                                <div className="card fll-height marketplace product-box">

                                </div>
                            </div>
                            <div className="col-md-6  col-lg-3 marketplace-preview-item">
                                <div className="card fll-height header ballance">
                                    <div className="full-box full">
                                        <div className="full-box-item direction-row">
                                            <span className="card-title align-left">Purchased products</span>
                                            <span className="card-title align-right">{this.state.getDGSPurchaseCount}</span>
                                        </div>
                                        <div className="full-box-item direction-row">
                                            <p className="card-title align-left">Products available</p>
                                            <p className="card-title align-right">{this.state.getDGSGoodsCount}</p>
                                        </div>
                                        <div className="full-box-item direction-row">
                                            <p className="card-title align-left">Total purchases</p>
                                            <p className="card-title align-right">{this.state.getDGSPurchasesCount}</p>
                                        </div>
                                        <div className="full-box-item direction-row">
                                            <p className="card-title  align-left">Total tags</p>
                                            <p className="card-title  align-right">{this.state.getDGSTagCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={classNames({
                                'col-md-6  col-lg-3 marketplace-preview-item' : !this.state.isShowMore,
                                'col-md-6' : this.state.isShowMore
                            })}>
                                <div className="card  marketplace filters transparent">
                                    <div className="search-bar">
                                        <div className="row">
                                            <div className={classNames({
                                                'col-md-12' : !this.state.isShowMore,
                                                'col-md-6' : this.state.isShowMore
                                            })}>
                                                <div className="input-group-app search tabled">
                                                    <Form
                                                        onSubmit={(values) => this.handleSearchByAccount(values)}
                                                        render={({
                                                                     submitForm, values, addValue, removeValue, setValue, getFormState
                                                                 }) => (
                                                                    <form
                                                                        className="iconned-input-field"
                                                                        onSubmit={submitForm}
                                                                    >
                                                                        <InputMask mask='APL-****-****-****-*****' value={this.state.value}  onChange={(e) => {if (e.target) setValue('recipient', e.target.value)}}>
                                                                            {(inputProps) => {
                                                                                return (
                                                                                    <Text  {...inputProps} field="seller" placeholder="Seller`s Account ID" />
                                                                                );
                                                                            }}
                                                                        </InputMask>
                                                                        <button className="input-icon">
                                                                            <i className="zmdi zmdi-search" />
                                                                        </button>
                                                                    </form>
                                                                )}
                                                    />

                                                </div>
                                            </div>
                                            <div className={classNames({
                                                'col-md-12' : !this.state.isShowMore,
                                                'col-md-6' : this.state.isShowMore
                                            })}>
                                                <div className="input-group-app search tabled">
                                                    <Form
                                                        onSubmit={(values) => this.handleSearchByTag(values)}
                                                        render={({
                                                                     submitForm, values, addValue, removeValue, setValue, getFormState
                                                                 }) => (
                                                                    <form
                                                                        className="iconned-input-field"
                                                                        onSubmit={submitForm}
                                                                    >
                                                                        <Text field="tag" placeholder="Title, description or Tag" />

                                                                        <button className="input-icon">
                                                                            <i className="zmdi zmdi-search" />
                                                                        </button>
                                                                    </form>
                                                                )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filters-bar" ref={'filtersBar'}>
                                        {
                                            this.state.getDGSTags &&
                                            this.state.getDGSTags.map((el, index) => {
                                                return (
                                                    <Link key={uuid()} to={'/marketplace/' + el.tag} className="btn primary">{el.tag}&nbsp;[{el.totalCount}]</Link>
                                                );
                                            })
                                        }
                                        <a onClick={this.showMoreController} className="btn primary blue" dangerouslySetInnerHTML={{__html: this.state.isShowMore ? 'View less' : 'View more'}}/>
                                        {
                                            this.state.getDGSTags && this.state.isShowMore &&
                                            <div
                                                ref={'btnBox'}
                                                className="btn-box"
                                                style={{
                                                    overflow: 'auto',
                                                    height: 52,
                                                    position: 'relative'
                                                }}
                                            >
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
                                <div className="form-group-app transparent marketplace no-padding-bottom">
                                    <div className="form-title padding-left offset-bottom">
                                        <p>
                                            Recent listings&nbsp;&nbsp;
                                            <Link to="/recent-listing" className="btn primary static">View more</Link>
                                        </p>
                                    </div>
                                    <div className="row marketplace-row">
                                        {
                                            this.state.getDGSGoods.map((el, index) => {
                                                return (
                                                    <div key={uuid()} className="marketplace-row-item col-xl-2">
                                                        <MarketplaceItem
                                                            fullHeight
                                                            relative={true}
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
                                <div className="form-group-app transparent marketplace no-padding-bottom">
                                    <div className="form-title padding-left offset-bottom">
                                        <p>
                                            Recent purchases&nbsp;&nbsp;
                                            <Link to="/purchased-products" className="btn primary static">View more</Link>
                                        </p>
                                    </div>
                                    <div className="row marketplace-row">
                                        {
                                            this.state.getDGSPurchases.map((el, index) => {
                                                return (
                                                    <div key={uuid()} className="marketplace-row-item col-xl-2">
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

export default connect(mapStateToProps, mapDispatchToProps)(Marketplace);