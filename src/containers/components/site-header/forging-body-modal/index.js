import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

const ForgingBodyModalWindow = ({forgingStatus, forgedBalanceATM, isActive}) => (
    <div className={classNames({
        "account-body-modal": true,
        "forging-body-modal-window": true,
        "active": isActive,
        "settings-menu": true,
        "settings-bar": true,
    })}>
        <div className="form-group-app">
            <div className="form-body">
                <div className="input-section">

                    <div className="image-button success">
                        <i className="zmdi zmdi-check-circle"/>
                        <label>Connected</label>
                    </div>

                    {
                        forgingStatus &&
                        forgingStatus.errorCode === 5 &&
                        <a
                            onClick={() => this.setForging({requestType: 'startForging'})}
                            className="image-button  danger"
                        >
                            <i className="zmdi zmdi-close-circle"/>
                            <label>Not forging</label>
                        </a>
                    }
                    {
                        forgingStatus &&
                        !forgingStatus.errorCode &&
                        <a
                            onClick={() => this.setForging({requestType: 'stopForging'})}
                            className="image-button  success"
                        >
                            <i className="zmdi zmdi-check-circle"/>
                            <label>Forging</label>
                        </a>
                    }
                    {
                        forgingStatus &&
                        forgingStatus.errorCode === 8 &&
                        <a
                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                            className="image-button danger"
                        >
                            <i className="zmdi zmdi-help"/>
                            <label>Unknown forging status</label>
                        </a>
                    }
                    {
                        forgingStatus &&
                        forgingStatus.errorCode === 4 &&
                        <a
                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                            className="image-button danger"
                        >
                            <i className="zmdi zmdi-help"/>
                            <label>Unknown forging status</label>
                        </a>
                    }
                    {
                        forgingStatus &&
                        forgingStatus.errorCode === 3 &&
                        <a
                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                            className="image-button danger"
                        >
                            <i className="zmdi zmdi-help"/>
                            <label>Unknown forging status</label>
                        </a>
                    }
                    {
                        forgingStatus &&
                        forgingStatus.errorCode === 2 &&
                        <a
                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                            className="image-button danger"
                        >
                            <i className="zmdi zmdi-help"/>
                            <label>Unknown forging status</label>
                        </a>
                    }
                    {
                        forgingStatus &&
                        forgingStatus.errorCode === 1 &&
                        <a
                            onClick={() => this.props.setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
                            className="image-button danger"
                        >
                            <i className="zmdi zmdi-help"/>
                            <label>Unknown forging status</label>
                        </a>
                    }


                    {/* <a className="mb-2">
                        {
                            this.state.block &&
                            <label>Height: {this.state.block.height}</label>
                        }
                    </a> */}
                    <p>
                        {
                            forgedBalanceATM &&
                            <label>Forged balance: {(forgedBalanceATM / 100000000).toLocaleString('en')}&nbsp;APL</label>
                        }
                    </p>

                </div>
            </div>
        </div>
    </div>
    
)

export default ForgingBodyModalWindow;