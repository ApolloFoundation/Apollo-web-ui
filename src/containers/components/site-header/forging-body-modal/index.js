import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

const ForgingBodyModalWindow = ({forgingStatus, forgedBalanceATM, isActive, setBodyModalParamsAction}) => (
    <div className={classNames({
        "account-body-modal": true,
        "forging-body-modal-window": true,
        "active": isActive,
        "settings-menu": true,
        "settings-bar": true,
        "p-0": true
    })}>
        <div className="form-group-app">
            <div className="form-body">
                <div className="input-section p-0">

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
                            onClick={() => setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
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
                            onClick={() => setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
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
                            onClick={() => setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
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
                            onClick={() => setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
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
                            onClick={() => setBodyModalParamsAction('ENTER_SECRET_PHRASE', null)}
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

const mapStateToProps = state => ({
    forgingStatus: state.account.forgingStatus,
    publicKey: state.account.publicKey,
    forgedBalanceATM: state.account.forgedBalanceATM,
    moalTtype: state.modals.modalType,
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch =>({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgingBodyModalWindow);