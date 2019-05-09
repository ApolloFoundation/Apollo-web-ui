import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader'
import {setBodyModalParamsAction} from '../../../../modules/modals';

class ActivePolls extends Component {
    render() {
        const {dashboardActivePolls, setBodyModalParamsAction} = this.props;

        return (
            <div className="card active-polls">
                <div className="card-title">Active Polls</div>
                <div className="card-body">
                    <div
                        className="full-box block word-brake align-start"
                        style={{
                            display: 'flex',
                            paddingBottom: '30px'
                        }}
                    >
                        {
                            dashboardActivePolls &&
                            dashboardActivePolls.map((el) => {
                                return (
                                    <Link
                                        style={{
                                            display: 'block',
                                            color: '#777777'
                                        }}
                                        className={'align-self-center'}
                                        to={'/followed-polls/' + el.poll}
                                    >
                                        {el.name}
                                    </Link>
                                )
                            })
                        }
                        {
                            !dashboardActivePolls &&
                            <ContentLoader/>
                        }
                        {
                            dashboardActivePolls &&
                            !dashboardActivePolls.length &&
                            <p
                                style={{
                                    fontSize: 13,
                                    color: '#000'
                                }}
                            >
                                No active polls.
                            </p>
                        }
                    </div>
                    <button
                        className="btn btn-right gray round round-bottom-right round-top-left absolute "
                        data-modal="sendMoney"
                        onClick={() => setBodyModalParamsAction('ISSUE_POLL')}
                    >
                        Create poll&nbsp;
                        <i className="arrow zmdi zmdi-chevron-right"/>
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardActivePolls: state.dashboard.dashboardActivePolls
})

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivePolls)
