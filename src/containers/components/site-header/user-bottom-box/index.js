import React from 'react';
import {connect} from 'react-redux';
import { getBlockchainStatusSelector } from 'selectors';
import {setBodyModalParamsAction} from 'modules/modals';

const UserBottomBox = ({appState, setBodyModalParamsAction}) => (
    <div className="network-overview">
        {appState && (
            <span
                className="mt-3 cursor-pointer"
                onClick={() => setBodyModalParamsAction('INFO_NETWORK')}
            >
                {appState.chainName}
            </span>
        )}
    </div>
)

const mapStateToProps = state => ({
    appState: getBlockchainStatusSelector(state),    
});

const mapDispatchToProps = {
    setBodyModalParamsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UserBottomBox);