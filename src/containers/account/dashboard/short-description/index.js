import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class ShortDescription extends Component {
    render () {
        const {dashboardMessagesCount, dashboardActiveSuffling, dashboardAliasesCount, dashboardTaggedData} = this.props;

        return (
            <div className="card header header-values coins flex chart-sprite position-4">
                <div className="general-info h-100">
                    <Link
                        to={'/messenger'}
                        className="general-info-item top-left"
                    >
                        <div className="top-bar">
                            {
                                dashboardMessagesCount === '100' ? '100+' : dashboardMessagesCount
                            }
                        </div>
                        <div className="bottom-bar">
                            Secure
                            messages
                        </div>
                    </Link>
                    <Link
                        to={'/active-shuffling'}
                        className="general-info-item top-right"
                    >
                        <div className="top-bar">
                            {dashboardActiveSuffling}
                        </div>
                        <div className="bottom-bar">
                            Coin
                            shuffling
                        </div>
                    </Link>
                    <Link
                        to="/aliases"
                        className="general-info-item bottom-left"
                    >
                        <div className="top-bar">
                            {dashboardAliasesCount}
                        </div>
                        <div className="bottom-bar">
                            Aliases
                        </div>
                    </Link>
                    <Link
                        to={'/data-storage'}
                        className="general-info-item bottom-right"
                    >
                        <div className="top-bar">
                            {dashboardTaggedData}
                        </div>
                        <div className="bottom-bar">
                            Data
                            storage
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    dashboardMessagesCount : state.dashboard.dashboardMessagesCount, 
    dashboardAliasesCount : state.dashboard.dashboardAliasesCount,
    dashboardActiveSuffling : state.dashboard.dashboardActiveSuffling,
    dashboardTaggedData : state.dashboard.dashboardTaggedData,
})

export default connect(mapStateToProps)(ShortDescription)