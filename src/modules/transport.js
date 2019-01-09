import io from 'socket.io-client';

export const SET_TRANSPORT_CONNECTION_STATUS  = 'SET_TRANSPORT_CONNECTION_STATUS';
export const SET_TRANSPORT_CONNECTION_POROPERTIES  = 'SET_TRANSPORT_CONNECTION_POROPERTIES';

export default (state = {}, action) => {
    switch(action.type) {
        case SET_TRANSPORT_CONNECTION_STATUS: 
            return {
                ...state,
                connectionStatus: action.payload
            }
        case SET_TRANSPORT_CONNECTION_POROPERTIES:
            return {
                ...state,
                connectionProperties : action.payload
            }
        default : 
            return state;
    }
}

var webSocket   = null;
/**
 * Event handler for clicking on button "Connect"
 */

/**
 * Open a new WebSocket connection using the given parameters
 */
export const openWSConnection = (protocol, hostname, port, endpoint) => dispatch => {
    var webSocketURL = null;
    webSocketURL = protocol + "://" + hostname + ":" + port + endpoint;

    console.log(22222)
    console.log("openWSConnection::Connecting to: " + webSocketURL);
    try {
        webSocket = new WebSocket(webSocketURL);

        console.log(webSocket)
        webSocket.onopen = function(openEvent) {
            dispatch ({
                type: SET_TRANSPORT_CONNECTION_STATUS,
                payload: true
            })
            console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
        };
        webSocket.onclose = function (closeEvent) {
            dispatch ({
                type: SET_TRANSPORT_CONNECTION_STATUS,
                payload: false
            })
            console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
        };
        webSocket.onerror = function (errorEvent) {
            // dispatch ({
            //     type: SET_TRANSPORT_CONNECTION_STATUS,
            //     payload: false
            // })
            console.log("WebSocket ERROR: " + JSON.parse(errorEvent));
        };
        webSocket.onmessage = function (messageEvent) {
            var wsMsg = JSON.parse(messageEvent.data);

            dispatch ({
                type: SET_TRANSPORT_CONNECTION_POROPERTIES,
                payload: wsMsg
            })

            console.log(messageEvent)
        };
    } catch (exception) {
        console.error(exception);
    }
}
/**
 * Send a message to the WebSocket server
 */
export const onSendClick = (message) => dispatch => {
    console.log(message)

    if (message && message['type'] === 'STOPREQUEST') {
        dispatch ({
            type: SET_TRANSPORT_CONNECTION_POROPERTIES,
            payload: null
        })
        return;
    }
    if (webSocket.readyState != WebSocket.OPEN) {
        console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }

    webSocket.send(JSON.stringify(message));
}

export const onConnectClick = () => dispatch => {
    dispatch(openWSConnection('ws', '127.0.0.1', '8888', '/'));
}

/**
 * Event handler for clicking on button "Disconnect"
 */
export const onDisconnectClick = ()  => dispatch => {
    webSocket.close();
}
