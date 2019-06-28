import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";

const InfoStatistic = ({dashboardMessagesCount, dashboardActiveSuffling, dashboardAliasesCount, dashboardTaggedData}) => {
    return (
        <div className={`card card-primary-items card-h-195`}>
            <div className="general-info h-100">
                <Link
                    to={'/messenger'}
                    className="general-info-item top-left"
                >
                    <div className="top-bar">
                        {dashboardMessagesCount === '100' ? '100+' : dashboardMessagesCount}
                    </div>
                    <div>
                        Secure<br/>messages
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
                        Coin<br/>shuffling
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
                        Secure<br/>Aliases
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
                        Data<br/>storage
                    </div>
                </Link>
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    dashboardMessagesCount: state.dashboard.dashboardMessagesCount,
    dashboardAliasesCount: state.dashboard.dashboardAliasesCount,
    dashboardActiveSuffling: state.dashboard.dashboardActiveSuffling,
    dashboardTaggedData: state.dashboard.dashboardTaggedData,
});

export default connect(mapStateToProps)(InfoStatistic)