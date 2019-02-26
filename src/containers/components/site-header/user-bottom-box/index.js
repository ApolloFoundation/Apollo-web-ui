import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

class UserBottomBox extends Component {
    render () {
        const {appState, setBodyModalParamsAction, children} = this.props;

        return (
            <div className="network-overview">
                {
                    window.innerWidth &&
                    this.props.children &&
                    <div className="media-page-actions">
                        {children}
                    </div>
                }
                {
                    appState &&
                    <a
                        className="mt-3"
                        onClick={() => setBodyModalParamsAction('INFO_NETWORK')}
                    >
                        {this.props.appState.chainName}
                    </a>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    appState: state.account.blockchainStatus,    
})

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserBottomBox);