import React, {Component} from 'react';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader';
import {Link} from 'react-router-dom';

class AssetsValue extends Component {

    render () {
        const {dashboardAssets, positionState2, position2} = this.props;

        return (
            <div
                className={`card header assets chart-sprite justify-content-start position-2 ${positionState2 ? "show-hide-content" : ""}`}>
                <div className="arrow-block" onClick={position2}>
                    <div className="arrow"/>
                </div>
                <div className="card-title">Assets Value</div>
                {
                    dashboardAssets &&
                    <div className="page-body-item-content">
                        <Link
                            to={'/my-assets'}
                            style={{display: 'block'}}
                            className="amount"
                        >
                            <div className="text">
                                {Math.round(dashboardAssets.total).toLocaleString('en')}
                            </div>
                            {
                                Math.round(dashboardAssets.total) > 100000000000 &&
                                <div className="amount-tooltip">
                                    <div className="amount-tooltip-text">
                                        {Math.round(this.state.assetsValue).toLocaleString('en')}
                                    </div>
                                </div>
                            }
                            <div className="owned">
                                {dashboardAssets.count} <span>Owned</span>
                            </div>
                        </Link>
                    </div>
                }
                {
                    !dashboardAssets &&
                    <ContentLoader white noPaddingOnTheSides/>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardAssets : state.dashboard.dashboardAssets
})

export default connect(mapStateToProps)(AssetsValue)