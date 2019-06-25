import React, {Component} from 'react';
import {connect} from 'react-redux';
import ContentLoader from '../../../../components/content-loader';
import {Link} from 'react-router-dom';

class AssetsValue extends Component {

    render() {
        const {dashboardAssets, positionState2, position2} = this.props;

        return (
            <div
                className={`card ${positionState2 ? "show-hide-content" : ""}`}>
                <div className="arrow-block" onClick={position2}>
                    <div className="arrow"/>
                </div>
                <div className="card-title card-title-lg bg-primary">Assets Value</div>
                <div className="card-body">
                    {dashboardAssets && (
                        <Link
                            to={'/my-assets'}
                            className="amount d-flex justify-content-between align-items-center h-100"
                        >
                            <div className="text-lg text-green">
                                {Math.round(dashboardAssets.total).toLocaleString('en')}
                            </div>
                            <div className="text-lg text-green">
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
                            </div>
                        </Link>
                    )}
                    {
                        !dashboardAssets &&
                        <ContentLoader white noPaddingOnTheSides/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardAssets: state.dashboard.dashboardAssets
})

export default connect(mapStateToProps)(AssetsValue)