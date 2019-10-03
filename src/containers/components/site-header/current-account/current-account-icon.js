import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const CurrentAccountIcon = ({name, publicKey, appState, setBodyModalParamsAction}) => (
    <>
        <div className="user-avatar stop">
            <i className="zmdi stop zmdi-account"/>
        </div>
        <div className="user-box-info">
            <div>
                {name && (
                    <p className={'user-name'}>
                        {name}
                    </p>
                )}
                <p className={`user-status text-ellipsis ${publicKey ? 'verified' : ''}`}>
                    {publicKey ? 'Verified' : 'Not Verified'}
                </p>
            </div>
            <i className="user-box-icon to-revert zmdi zmdi-chevron-down"/>
        </div>
    </>
);

const mapStateToProps = state => ({
    name: state.account.name,
    publicKey: state.account.publicKey,
    appState: state.account.blockchainStatus,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values))
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentAccountIcon);