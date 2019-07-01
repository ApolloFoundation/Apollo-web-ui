import React from 'react';
import {ReactComponent as ArrowRight} from "../../../assets/arrow-right.svg";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import ContentLoader from "../../components/content-loader";

const ActivePolls = ({dashboardActivePolls, setBodyModalParamsAction}) => (
    <div className={`card card-light card-h-255`}>
        <div className="card-title">
            <div className={'title'}>Active Poll</div>
        </div>
        <div className="card-body">
            <div className={'d-flex flex-column justify-content-between h-100'}>
                {dashboardActivePolls ? (
                    !dashboardActivePolls.length ? (
                        <p>No active polls.</p>
                    ) : (
                        dashboardActivePolls.map((el) => {
                            return (
                                <Link
                                    className={'poll-item mb-3'}
                                    to={'/followed-polls/' + el.poll}
                                >
                                    <div className={'poll-item-icon'}>?</div>
                                    {el.name}
                                </Link>
                            )
                        })
                    )
                ) : (
                    <ContentLoader/>
                )}
                <button
                    type={'button'}
                    className={'btn btn-grey btn-lg'}
                    onClick={() => setBodyModalParamsAction('ISSUE_POLL')}
                >
                    <span>Create poll</span>
                    <div className={'btn-arrow'}>
                        <ArrowRight/>
                    </div>
                </button>
            </div>
        </div>
    </div>
);


const mapStateToProps = state => ({
    dashboardActivePolls: state.dashboard.dashboardActivePolls
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivePolls);