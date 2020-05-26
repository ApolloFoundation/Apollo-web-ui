import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {connect} from 'react-redux';
import {formatTimestamp} from '../../../../helpers/util/time';
import {ONE_APL} from '../../../../constants';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const Trade = ({quantityATU, tradeType, timestamp, asset, decimals, priceATM, name, formatTimestamp, setBodyModalParamsAction, history}) => {
    const gotToAsset = () => {
        setBodyModalParamsAction();
        history.push("/asset-exchange/" + asset);
    };

    return (
        <tr key={uuidv4()}>
            <td className={'blue-link-text'}>
                <span
                    className={'cursor-pointer blue-link-text'}
                    onClick={gotToAsset}
                >
                    {name}
                </span>
            </td>
            <td>{formatTimestamp(timestamp)}</td>
            <td>{tradeType}</td>
            <td className="align-right">{quantityATU / Math.pow(10, decimals)}</td>
            <td className="align-right">{(priceATM * Math.pow(10, decimals)) / ONE_APL}</td>
            <td className="align-right">{(quantityATU / Math.pow(10, decimals)) * ((priceATM * Math.pow(10, decimals)) / ONE_APL)}</td>
        </tr>
    )
};

const mapStateToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(null, mapStateToProps)(withRouter(Trade));
