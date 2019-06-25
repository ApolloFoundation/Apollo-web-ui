import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class ShortDescription extends Component {
    render () {
        const {dashboardMessagesCount, dashboardActiveSuffling, dashboardAliasesCount, dashboardTaggedData} = this.props;

        return (
            <div className="card header header-values bg-green">
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
                        <div>
                            Secure messages
                        </div>
                    </Link>
                    <Link
                        to={'/active-shuffling'}
                        className="general-info-item top-right"
                    >
                        <div className="top-bar">
                            {dashboardActiveSuffling}
                        </div>
                        <div>
                            Coin shuffling
                        </div>
                    </Link>
                    <Link
                        to="/aliases"
                        className="general-info-item bottom-left"
                    >
                        <div className="top-bar">
                            {dashboardAliasesCount}
                        </div>
                        <div>
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
                        <div>
                            Data storage
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