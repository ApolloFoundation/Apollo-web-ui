/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import config from '../../../../config';

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

const makeDownloadction = (transaction, downloadUrl) => {
    if (window.downloadFile) {
        window.downloadFile(transaction, downloadUrl);
    } else {
        document.location.href = config.api.serverUrl + "requestType=downloadTaggedData&transaction=" + transaction + "&retrieve=true";
    }
}

const DataStorageItem  = props => (
    <tr>
        <td className="blue-link-text">
            <a onClick={() => props.getTransaction(props.transaction)}>{props.name}</a>
        </td>
        <td className="blue-link-text">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.account)}>{props.accountRS}</a>
        </td>
        <td>{props.type}</td>
        <td>{props.channel}</td>
        <td>{props.filename}</td>
        <td className="align-right">
            <div className="btn-box">
                <a
                    onClick={() => makeDownloadction(props.transaction, config.api.serverUrl + "requestType=downloadTaggedData&transaction=" + props.transaction + "&retrieve=true")}
                    className="btn btn-default"
                >
                    Download
                </a>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(DataStorageItem);