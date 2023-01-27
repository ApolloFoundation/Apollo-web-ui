import React from 'react';
import {connect} from 'react-redux';
import {onDisconnectClick, onSendClick, onConnectClick} from 'modules/transport';
import {setBodyModalParamsAction} from 'modules/modals';

const Transport = ({connectionStatus, connectionProperties, onSendClick, onDisconnectClick, onConnectClick, setBodyModalParamsAction}) => {
    const STARTREQUEST = {
        "type":"STARTREQUEST", 
        "serversjson":"./servers.json", 
        "uniqueenable":true, 
        "shuffle":false, 
        "uniqueport":25000, 
        "logpath":"/var/log",
        "id": Math.random() * (100 - 1) + 1
    }

    const STOPREQUEST = {
        "type":"STOPREQUEST",
        "id":30
    };

    return (
        <React.Fragment>
            {
                connectionStatus ? 
                <React.Fragment>
                    <a
                        onClick={() => onDisconnectClick()}
                        className="image-button success"
                    >
                        <i className="zmdi zmdi-check-circle"/>
                        <label>Connected with transport</label>
                    </a>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    &nbsp;

                    {
                        connectionProperties &&
                        connectionProperties.event === 'CONNECT' ?
                        <React.Fragment>
                            <a
                                onClick={() => onSendClick(STOPREQUEST)}                            
                                className="image-button success"
                            >
                                <i className="zmdi zmdi-check-circle"/>
                                <label>Stop Transporn</label>
                            </a>
                            <a
                                onClick={() => setBodyModalParamsAction("TRANSPORT_INFO")}                            
                                className="image-button info"
                            >
                                <label>View transport info</label>
                            </a>
                        </React.Fragment>
                        :
                        <a
                            onClick={() => onSendClick(STARTREQUEST)}                            
                            className="image-button danger"
                        >
                            <i className="zmdi zmdi-close-circle"/>
                            <label>Start Transporn</label>
                        </a> 
                    }
                </React.Fragment>
                :
                <a
                    onClick={() => onConnectClick()}
                    className="image-button danger"
                >
                    <i className="zmdi zmdi-close-circle"/>
                    <label>No connection with transport</label>
                </a>
            }
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
        </React.Fragment> 
    )
}

const mapStateToPropms = state => ({
    connectionStatus: state.transport.connectionStatus,
    connectionProperties: state.transport.connectionProperties,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction : (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    onSendClick : (message) => dispatch(onSendClick(message)),
    onConnectClick : () => dispatch(onConnectClick()),
    onDisconnectClick : () => dispatch(onDisconnectClick())
});

export default connect(mapStateToPropms, mapDispatchToProps)(Transport)