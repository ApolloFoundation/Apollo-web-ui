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
            <div className="btn-box inline">
                <a
                    onClick={() => props.editAlias}
                    className="btn primary blue"
                    href={config.api.serverUrl + "requestType=downloadTaggedData&transaction=" + props.transaction + "&retrieve=true"}
                >
                    Download
                </a>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(DataStorageItem);