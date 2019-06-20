import React, {Component} from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

import MarketplaceGeneral from '../marketplace-general/';
import MarketplaceTags from '../marketplace-tags/';
import {getMarketplaceGeneralInfo} from '../../../../modules/marketplace';

class MarketplaceDashboardHeader extends Component {

    state = {};

    componentDidMount = () => {
        this.props.getMarketplaceGeneralInfo()
    }

    showMoreController = () => {
        this.setState({
            ...this.state,
            isShowMore: !this.state.isShowMore
        });
    };

    render () {
        return (

            <>
                <div className={classNames({
                    'col-md-12 col-lg-6 marketplace-preview-item' : !this.state.isShowMore,
                    'col-md-3' : this.state.isShowMore,
                    'pl-3': true,
                    'pr-0': true,
                    'pb-3': true,
                })}>
                    <div className="card fll-height marketplace product-box" />
                </div>
                <div className="col-md-6 col-lg-3 marketplace-preview-item pl-3 pr-0 pb-3">
                    <MarketplaceGeneral />
                </div>
                <div className={classNames({
                    'col-md-6  col-lg-3 marketplace-preview-item' : !this.state.isShowMore,
                    'col-md-6' : this.state.isShowMore,
                    'pb-3': true,
                    'pl-3': true,
                    'pr-0': true,
                })}>
                    <MarketplaceTags
                        isShowMore={this.state.isShowMore}
                        showMoreController={this.showMoreController}
                    />
                </div>
            </>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getMarketplaceGeneralInfo: () => dispatch(getMarketplaceGeneralInfo())
})

export default connect(null, mapDispatchToProps)(MarketplaceDashboardHeader);