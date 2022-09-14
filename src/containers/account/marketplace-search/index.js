/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import SiteHeader from '../../components/site-header/index';
import MarketplaceItem from '../marketplace/marketplace-card/index'
import {searchDGSGoodsAction} from "../../../actions/marketplace";

import classNames from "classnames";
import InfoBox from "../../components/info-box";

const mapDispatchToProps = dispatch => ({
    searchDGSGoodsAction: (reqParams) => dispatch(searchDGSGoodsAction(reqParams))
});

const itemsPerPage = 8;

class MarketplaceSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage - 1,
            tag: this.props.match.params ? this.props.match.params.tag : null,
            isGrid: true,

        };
    }

    componentWillMount() {
        if (this.props.match.params) this.loadAccount(this.props.match.params.tag);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params) this.loadAccount(newProps.match.params.tag);
    }

    loadAccount = (tag) => {
        const searchingBy = /^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(tag) ?
            {
                seller: tag,
                requestType: 'getDGSGoods'
            } : {
                query: tag
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
    };

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.searchDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                DGSGoods: getDGSGoods.goods
            })
        }
    };

    onPaginate = (page) => {
        const searchingBy = /^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(this.props.match.params.tag) ?
            {
                seller: this.state.tag,
                requestType: 'getDGSGoods'
            } : {
                tag: this.state.tag
            };

        let reqParams = {
            includeCounts: true,

            page: page,
            tag: this.state.tag,
            ...searchingBy,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage - 1
        };

        this.setState({
            ...reqParams,
        }, () => {
            this.getDGSGoods(reqParams)
        });
    };

    handleGrid = () => {
        this.setState({
            isGrid: !this.state.isGrid
        })
    };

    render() {
        const {DGSGoods} = this.state;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={`Search <small>"${this.state.tag}"</small>`}
                    showPrivateTransactions={'ledger'}
                >
                    <Link
                        to='/marketplace'
                        className="btn btn-default"
                    >
                        Back
                    </Link>
                </SiteHeader>
                <div className="page-body container-fluid full-screen-block no-padding-on-the-sides marketplace-container">
                    {(DGSGoods && DGSGoods.length > 0) ? (
                        <div className="marketplace">
                            <div
                                className={classNames({
                                    'row': true,
                                    'fluid-row': !this.state.isGrid
                                })}
                            >
                                {DGSGoods.map((el, index) => (
                                    <div
                                        key={`marketplace-search-item-${index}`}
                                        className={classNames({
                                            'marketplace-item': this.state.isGrid,
                                            'marketplace-item--full-width': !this.state.isGrid,
                                            'd-flex pl-3 pb-3 ': true
                                        })}
                                    >
                                        <MarketplaceItem
                                            tall={this.state.isGrid}
                                            fluid={!this.state.isGrid}
                                            isHovered
                                            index={index}
                                            {...el}
                                        />
                                    </div>
                                ))}
                                <div className="btn-box pagination">
                                    <button
                                        type={'button'}
                                        className={classNames({
                                            'btn btn-default': true,
                                            'disabled': this.state.page <= 1,
                                        })}
                                        onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                    >
                                        Previous
                                    </button>
                                    <div className='pagination-nav'>
                                        <span>{this.state.page * itemsPerPage - itemsPerPage + 1}</span>
                                        <span>&hellip;</span>
                                        <span>{(this.state.page * itemsPerPage - itemsPerPage) + DGSGoods.length}</span>
                                    </div>
                                    <button
                                        type={'button'}
                                        onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                        className={classNames({
                                            'btn btn-default': true,
                                            'disabled': DGSGoods.length < itemsPerPage
                                        })}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <InfoBox default>
                            Nothing was found.
                        </InfoBox>
                    )}
                </div>
            </div>
        );
    }
};

export default connect(null, mapDispatchToProps)(MarketplaceSearch);
