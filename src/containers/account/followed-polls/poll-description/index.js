import React from 'react';
import Pie from '../pie-diagram';
import {connect} from 'react-redux';

import {setBodyModalParamsAction} from '../../../../modules/modals';
import {ONE_APL} from "../../../../constants";

const PollDescription = ({colors, poll, pollResults, setBodyModalParamsAction, balanceAPL}) => {
    let checkAction = false;
    if (poll.minBalanceModel === 1 && parseFloat(poll.minBalance) >= (balanceAPL / ONE_APL)) {
        checkAction = true;
    }
    return (
        <div className="card card-flexible mb-3">
            <div className="row">
                <div className="col-md-7">
                    <div className="right-bar">
                        <div className="form-group-app">
                            <div className="form-title word-brake">
                                <p>{poll.name}</p>
                            </div>
                            <div className="account-bar">
                                <div className="information">
                                    <div className="title">Account ID:&nbsp;&nbsp;</div>
                                    <div className="content">{poll.accountRS}</div>
                                </div>
                                <div className="information">
                                    <div className="title">Poll ID:&nbsp;&nbsp;</div>
                                    <div className="content">{poll.poll}</div>
                                </div>
                            </div>
                            <div className="description-bar word-brake">
                                <p>{poll.description}</p>
                            </div>
                            {!poll.finished && (
                                <button
                                    type={'button'}
                                    onClick={() => setBodyModalParamsAction('CAST_VOTE', poll.poll)}
                                    className={`btn btn-primary static blue ${checkAction ? 'blue-disabled' : ''}`}
                                >
                                    Vote in poll
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className="col-md-5"
                    style={{
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    {
                        colors.length > 0 && pollResults && poll.options && pollResults.results &&
                        <Pie
                            data={pollResults.results.map((el, index) => {
                                return parseInt(el.result) || 0.05
                            })}
                            votes={poll.options}
                            radius={ 150 }
                            hole={ 0 }
                            colors={ colors }
                            strokeWidth={ 1 }
                            stroke={ 'rgba(0, 0, 0, .5)' }
                        />
                    }

                </div>
            </div>

        </div>

    )
};

const mapStateToProps = state => ({
    balanceAPL: state.account.unconfirmedBalanceATM,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PollDescription);