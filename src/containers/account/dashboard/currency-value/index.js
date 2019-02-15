import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ContentLoader from '../../../components/content-loader';
import {connect} from 'react-redux';

class CurrencyValue extends Component {
    render () {
        const {dashboardCurrencies, position3, positionState3} = this.props;

        return (
            <div
                className={`card header currencies chart-sprite justify-content-start position-3 ${positionState3 ? "show-hide-content" : ""}`}>
                <div className="arrow-block" onClick={position3}>
                    <div className="arrow"/>
                </div>
                <div className="card-title">Currencies Value</div>
                {
                    dashboardCurrencies &&
                    <div className="page-body-item-content">
                        <Link
                            className="amount"
                            to={'/my-currencies'}
                            style={{display: 'block'}}
                        >
                            {dashboardCurrencies.total}
                            <div className="owned">
                                {dashboardCurrencies.count} <span>Owned</span>
                            </div>
                        </Link>
                    </div>
                }
                {
                    !dashboardCurrencies &&
                    <ContentLoader white noPaddingOnTheSides/>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardCurrencies: state.dashboard.dashboardCurrencies
})

export default connect(mapStateToProps)(CurrencyValue)