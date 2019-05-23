/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";
import CryptoJS from 'crypto-js'
import {ONE_APL} from '../../../../constants';

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class Block extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {

        const {height, totalAmountATM, timestamp, totalFeeATM, numberOfTransactions, formatTimestamp, setBodyModalParamsAction, generator, generatorRS, payloadLength} = this.props;

        return (
            <tr key={uuid}>
                <td className="blue-link-text">
                    <a
                        onClick={() => setBodyModalParamsAction('INFO_BLOCK', height)}
                    >
                        {height}
                    </a>
                </td>
                <td className="align-right">
                    <p>{formatTimestamp(timestamp)}</p>
                </td>
                <td className="align-right">{totalAmountATM / ONE_APL}</td>
                <td className="align-right">{totalFeeATM    / ONE_APL}</td>
                <td className="align-right">
                    {numberOfTransactions}
                </td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', generator)}>{generatorRS}</a>
                </td>
                <td className="align-right"><p>{payloadLength} B</p>
                </td>
                {/*<td className="align-right"><a>{Math.round(this.props.block.baseTarget / 153722867 * 100)} %</a>*/}
                {/*</td>*/}
            </tr>
        );
    }
}

export default connect(null, mapDispatchToProps)(Block);
