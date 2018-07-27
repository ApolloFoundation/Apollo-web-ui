import React from 'react';
import uuid from 'uuid';

class Block extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <tr>
                <td className="blue-link-text">
                    <a onClick={this.props.setBlockInfo.bind(this, 'INFO_BLOCK', this.props.block.height)}>{this.props.block.height}</a>
                </td>
                <td className="align-right">
                    <a>{this.props.block.timestamp}</a>
                </td>
                <td className="align-right">{this.props.block.totalAmountATM}</td>
                <td className="align-right">{this.props.block.totalFeeATM}</td>
                <td className="align-right"><a>1</a>
                </td>
                <td className="blue-link-text"><a>{this.props.block.generatorRS}</a>
                </td>
                <td className="align-right"><a>{this.props.block.payloadLength} B</a>
                </td>
                <td className="align-right"><a>{this.props.block.baseTarget} %</a>
                </td>
            </tr>
        );
    }
}

export default Block;