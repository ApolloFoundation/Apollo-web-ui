import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

class UserBottomBox extends Component {
    render () {
        const {appState, setBodyModalParamsAction} = this.props;

        return (
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
    }
}

const mapStateToProps = state => ({
    appState: state.account.blockchainStatus,    
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBottomBox);