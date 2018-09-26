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

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

class Block extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <tr key={uuid}>
                <td className="blue-link-text">
                    <a onClick={this.props.setBlockInfo.bind(this, 'INFO_BLOCK', this.props.block.height)}>{this.props.block.height}</a>
                </td>
                <td className="align-right">
                    <a>{this.props.formatTimestamp(this.props.block.timestamp)}</a>
                </td>
                <td className="align-right">{this.props.block.totalAmountATM / 100000000}</td>
                <td className="align-right">{this.props.block.totalFeeATM    / 100000000}</td>
                <td className="align-right"><a>1</a>
                </td>
                <td className="blue-link-text">
                    <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.props.block.generator)}>{this.props.block.generatorRS}</a>
                </td>
                <td className="align-right"><a>{this.props.block.payloadLength} B</a>
                </td>
                {/*<td className="align-right"><a>{Math.round(this.props.block.baseTarget / 153722867 * 100)} %</a>*/}
                {/*</td>*/}
            </tr>
        );
    }
}

export default connect(null, mapDispatchToProps)(Block);