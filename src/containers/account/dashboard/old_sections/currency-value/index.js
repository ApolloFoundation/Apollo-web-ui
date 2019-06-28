import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ContentLoader from '../../../../components/content-loader';
import {connect} from 'react-redux';

class CurrencyValue extends Component {
    render() {
        const {dashboardCurrencies, position3, positionState3} = this.props;

        return (
            <div
                className={`card ${positionState3 ? "show-hide-content" : ""}`}>
                <div className="arrow-block" onClick={position3}>
                    <div className="arrow"/>
                </div>
                <div className="card-title card-title-lg bg-primary">Currencies Value</div>
                <div className="card-body">
                    {dashboardCurrencies && (
                        <Link
                            className="amount d-flex justify-content-between align-items-center h-100"
                            to={'/my-currencies'}
                        >
                            <div className="text-lg text-green">
                                {dashboardCurrencies.total}
                            </div>
                            <div className="text-lg text-green">
                                <div className="owned">
                                    {dashboardCurrencies.count} <span>Owned</span>
                                </div>
                            </div>
                        </Link>
                    )}
                    {
                        !dashboardCurrencies &&
                        <ContentLoader white noPaddingOnTheSides/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardCurrencies: state.dashboard.dashboardCurrencies
})

export default connect(mapStateToProps)(CurrencyValue)