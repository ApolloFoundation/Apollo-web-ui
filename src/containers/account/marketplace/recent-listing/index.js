/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import classNames from "classnames";
import {Link} from 'react-router-dom';
import SiteHeader from '../../../components/site-header/index';
import MarketplaceItem from '../marketplace-card/index'
import {getDGSGoodsAction} from "../../../../actions/marketplace";

import '../MarketPLace.scss';

const mapDispatchToProps = dispatch => ({
    getDGSGoodsAction: (reqParams) => dispatch(getDGSGoodsAction(reqParams))
});

const itemsPerPage = 8;

class ResentMarketplaceListing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            firstIndex: 0,
            lastIndex: itemsPerPage - 1,
            isGrid: true
        };
    }

    componentWillMount() {
        this.getDGSGoods({
            includeCounts: true,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            completed: true
        })
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    onPaginate = (page) => {
        let reqParams = {
            includeCounts: true,
            page: page,
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

    handleCardMouseOver = (e) => {
        e.currentTarget.classList.add('active')
    };

    handleCardMouseOut = (e) => {
        const selected = Object.values(document.querySelectorAll('.site-content .page-content .page-body .marketplace .row > *.active'));

        selected.map((el, index) => {
            setTimeout(() => {
                el.classList.remove('active')
            }, 300)
        });

    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Recent listing'}
                >
                    <Link
                        to={'/marketplace'}
                        className="btn btn-default"
                    >
                        Back
                    </Link>
                </SiteHeader>
                <div
                    className="page-body container-fluid full-screen-block no-padding-on-the-sides marketplace-container">
                    <div
                        className="marketplace"
                    >
                        <div
                            className={classNames({
                                'row': true,
                                'fluid-row': !this.state.isGrid
                            })}
                            style={{
                                position: 'relative',
                            }}
                        >
                            {
                                this.state.getDGSGoods &&
                                this.state.getDGSGoods.map((el, index) => {
                                    return (
                                        <div
                                            key={`marketplace-item-${index}`}
                                            className={classNames({
                                                'marketplace-item': this.state.isGrid,
                                                'marketplace-item--full-width': !this.state.isGrid,
                                                'd-flex': true
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
                                    );
                                })
                            }
                            {
                                this.state.getDGSGoods &&
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
                                        <span>{(this.state.page * itemsPerPage - itemsPerPage) + this.state.getDGSGoods.length}</span>
                                    </div>
                                    <button
                                        type={'button'}
                                        onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                        className={classNames({
                                            'btn btn-default': true,
                                            'disabled': this.state.getDGSGoods.length < itemsPerPage
                                        })}
                                    >
                                        Next
                                    </button>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(ResentMarketplaceListing);