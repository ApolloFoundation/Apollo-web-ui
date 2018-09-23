import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import SiteHeader from '../../components/site-header/index';
import MarketplaceItem from '../marketplace/marketplace-card'
import {searchDGSGoodsAction} from "../../../actions/marketplace";

import classNames from "classnames";

import '../marketplace/MarketPLace.css';
import uuid from "uuid";

const mapDispatchToProps = dispatch => ({
    searchDGSGoodsAction: (reqParams) => dispatch(searchDGSGoodsAction(reqParams))
});

class MarketplaceSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            firstIndex: 0,
            lastIndex: 7,
            tag: this.props.match.params.tag,
            isGrid: true,

        };
    }

    componentWillMount() {
        this.loadAccount(this.props.match.params.tag);
    }

    componentWillReceiveProps(newProps) {
        this.loadAccount(newProps.match.params.tag);
    }

    loadAccount = (tag) => {
        console.log(tag);
        const searchingBy = /^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(tag) ?
            {
                seller : tag,
                requestType: 'getDGSGoods'
            } : {
                tag : tag
            };

        this.getDGSGoods({
            includeCounts: true,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            completed: true,
            ...searchingBy
        });
        this.setState({
            tag: tag
        })
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.searchDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    onPaginate = (page) => {
        const searchingBy = /^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(this.props.match.params.tag) ?
            {
                seller : this.state.tag,
                requestType: 'getDGSGoods'
            } : {
                tag : this.state.tag
            }

        let reqParams = {
            includeCounts: true,

            page: page,
            tag: this.state.tag,
            ...searchingBy,
            firstIndex: page * 8 - 8,
            lastIndex:  page * 8 - 1
        };

        this.setState({
            ...this.state,
            ...reqParams,
        }, () => {
            this.getDGSGoods(reqParams)
        });
    };

    handleGrid = () => {
        this.setState({
            ...this.state,
            isGrid: !this.state.isGrid
        })
    };


    handleCardMouseOver = (e) =>  {
        e.currentTarget.classList.add('active')
    };
    handleCardMouseOut = (e) =>  {
        const selected = Object.values(document.querySelectorAll('.site-content .page-content .page-body .marketplace .row > *.active'));

        const event = e;
        selected.map((el, index) => {
            setTimeout(() => {
                el.classList.remove('active')
            },300)
        });

    };


    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Search “' + this.state.tag + '”'}
                    showPrivateTransactions={'ledger'}
                >
                    <Link
                        to='/marketplace'
                        className="btn primary"
                    >
                        Back
                    </Link>
                    <a
                        className="btn primary transparent icon-button with-out-border"
                        style={{marginLeft: 15}}
                        onClick={this.handleGrid}
                    >
                        {
                            this.state.isGrid &&
                            <i className="zmdi zmdi-view-module" />
                        }
                        {
                            !this.state.isGrid &&
                            <i className="zmdi zmdi-view-list" />
                        }
                    </a>
                </SiteHeader>
                <div className="page-body container-fluid full-screen-block no-padding-on-the-sides marketplace-container">
                    <div
                        className="marketplace"
                        style={{
                            marginBottom: 15
                        }}
                    >
                        <div
                            className="row"
                            style={{
                                position: 'relative',
                                height: "100%",
                                paddingBottom: 35
                            }}
                        >
                            {
                                this.state.getDGSGoods &&
                                this.state.getDGSGoods.map((el, index) => {
                                    return (
                                        <div
                                            key={uuid()}
                                            className={classNames({
                                                'marketplace-item' : this.state.isGrid,
                                                'col-xs-12 col-sm-12 col-md-12 col-lg-12': !this.state.isGrid,
                                        })}>
                                            <MarketplaceItem
                                                tall={this.state.isGrid}
                                                fluid={!this.state.isGrid}
                                                isHovered
                                                index={index}
                                                {...el}
                                            />
                                        </div>
                                    );

                                })
                            }
                            {
                                this.state.getDGSGoods &&
                                <div
                                    className="btn-box relative padding-bottom"
                                    style={{
                                        position: "relative",
                                        height: 37,
                                        marginBottom: 15
                                    }}
                                >
                                    <a
                                        className={classNames({
                                            'btn' : true,
                                            'btn-left' : true,
                                            'disabled' : this.state.page <= 1
                                        })}
                                        style={{
                                            left: 7.5
                                        }}
                                        onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                    >
                                        Previous
                                    </a>
                                    {
                                        this.state.getDGSGoods.length < 8 &&
                                        <div className='pagination-nav'>
                                            <span>{(this.state.page * 8) - 7}</span>
                                            <span>&hellip;</span>
                                            <span>{this.state.page * 8 + this.state.getDGSGoods.length - 8}</span>
                                        </div>
                                    }
                                    {
                                        this.state.getDGSGoods.length === 8 &&
                                        <div className='pagination-nav'>
                                            <span>{this.state.firstIndex + 1}</span>
                                            <span>&hellip;</span>
                                            <span>{this.state.lastIndex + 1}</span>
                                        </div>
                                    }
                                    <a
                                        onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                        className={classNames({
                                            'btn' : true,
                                            'btn-right' : true,
                                            'disabled' : this.state.getDGSGoods.length < 8
                                        })}
                                        style={{
                                            right: 0
                                        }}
                                    >Next</a>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(null, mapDispatchToProps)(MarketplaceSearch);