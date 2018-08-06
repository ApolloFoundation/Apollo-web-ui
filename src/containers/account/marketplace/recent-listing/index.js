import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../../components/site-header/index';
import MarketplaceItem from '../marketplace-card'
import {getDGSGoodsAction} from "../../../../actions/marketplace";

import classNames from "classnames";

import '../MarketPLace.css';

const mapDispatchToProps = dispatch => ({
    getDGSGoodsAction: (reqParams) => dispatch(getDGSGoodsAction(reqParams))
});

@connect(null, mapDispatchToProps)
class ResentMarketplaceListing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: [],
            page: 1,
            firstIndex: 0,
            lastIndex: 7
        };
    }

    componentWillMount() {
        this.getDGSGoods({
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            completed: true
        })
    }

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

    onPaginate = (page) => {
        let reqParams = {
            page: page,
            firstIndex: page * 8 - 8,
            lastIndex:  page * 8 - 1
        };

        this.setState({
            ...this.state,
            ...reqParams,
        }, () => {
            this.getDGSGoods(reqParams)
        });
    }


    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Recent listing'}
                    showPrivateTransactions={'ledger'}
                />
                <div className="page-body container-fluid">
                    <div className="marketplace">
                        <div className="row" style={{position: 'relative', paddingBottom: 35}}>
                            {
                                this.state.getDGSGoods &&
                                this.state.getDGSGoods.map((el, index) => {
                                    return (
                                        <div className="col-md-3">
                                            <MarketplaceItem
                                                tall
                                                {...el}
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

export default ResentMarketplaceListing;