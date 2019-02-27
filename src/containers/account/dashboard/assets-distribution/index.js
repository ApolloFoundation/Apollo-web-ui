import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader'
import {getAccountAssetsAction, getSpecificAccountAssetsAction} from '../../../../actions/assets'
import CircleFigure from '../circle-figure';

class AssetsDistribution extends Component {
    state = {};

    render () {
        const {dashboardAssets} = this.props;

        return (
            <div className="card asset-portfolio mb-3">
                <div className="card-title">Asset Portfolio</div>
                {
                    !dashboardAssets &&
                    <ContentLoader noPaddingOnTheSides onPaddingTop/>
                }
                <div className="full-box">
                    {
                        dashboardAssets &&
                        dashboardAssets.distribution.map((el, index) => {
                            if (index < 3) {
                                return (
                                    <div className="full-box-item coin">
                                        <div className="coin-data">
                                            <CircleFigure
                                                index={index}
                                                percentage={((parseInt(el.quantityATU) / parseInt(el.initialQuantityATU)) * 100).toFixed(2)}
                                                type={el.quantityATU}
                                            />
                                            <div
                                                className="amount"
                                            >
                                                {((parseInt(el.quantityATU) / parseInt(el.initialQuantityATU)) * 100).toFixed(2)} %
                                            </div>
                                            <div className="coin-name">{el.name}</div>
                                            <Link
                                                to={'/asset-exchange/' + el.asset}
                                                className="more"
                                            >
                                                <i className="zmdi zmdi-more"/>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }
                    {
                        !!dashboardAssets &&
                        dashboardAssets.count === 0 &&
                        <p>No assets found.</p>
                    }
                </div>
            </div>
							
        )
    }
}

const mapStateToProps = state => ({
	dashboardAssets: state.dashboard.dashboardAssets,
})

const mapDispatchToProps = dispatch => ({
	getAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(AssetsDistribution)