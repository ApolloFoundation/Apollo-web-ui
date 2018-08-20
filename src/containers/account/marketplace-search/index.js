import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import SiteHeader from '../../components/site-header/index';
import MarketplaceItem from '../marketplace/marketplace-card'
import {searchDGSGoodsAction} from "../../../actions/marketplace";

import classNames from "classnames";

import '../marketplace/MarketPLace.css';

const mapDispatchToProps = dispatch => ({
    searchDGSGoodsAction: (reqParams) => dispatch(searchDGSGoodsAction(reqParams))
});

@connect(null, mapDispatchToProps)
class MarketplaceSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            firstIndex: 0,
            lastIndex: 7,
            tag: this.props.match.params.tag,
            isGrid: true
        };
    }

    componentWillMount() {
        this.getDGSGoods({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            completed: true,
            tag: this.state.tag
        })
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.searchDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            console.log(getDGSGoods.goods);
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    onPaginate = (page) => {
        let reqParams = {
            page: page,
            tag: this.state.tag,
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
                        className="btn primary transparent icon-button"
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
                <div className="page-body container-fluid full-screen-block no-padding-on-the-sides">
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
                                        <div className={classNames({
                                            'col-md-6 col-lg-3' : this.state.isGrid,
                                            'col-xs-12 col-sm-12 col-md-12 col-lg-12': !this.state.isGrid,
                                        })}>
                                            <MarketplaceItem
                                                tall={this.state.isGrid}
                                                fluid={!this.state.isGrid}
                                                index={index}
                                                {...el}
                                                this={this}
                                            />
                                        </div>
                                    );

                                })
                            }
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
                                        'disabled' : this.state.getDGSGoods < 8
                                    })}
                                >Next</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default MarketplaceSearch;