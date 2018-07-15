import React from 'react';
import uuid from 'uuid';

class Block extends React.Component {
    constructor(props) {
        super(props);
    }



    //
    // baseTarget
    //     :
    //     "6190467"
    // block
    //     :
    //     "1204094815350131703"
    // blockSignature
    //     :
    //     "85f77b451c0de958c39c6509526083ef0950b6732b60d7f08770b4a64f88f40a4cdcb4237a88a35efe40e041ece769eaa60de3805ae145848746cbb07f0aa627"
    // cumulativeDifficulty
    //     :
    //     "300461665222852766"
    // generationSignature
    //     :
    //     "3689bb78315aa7c1c5c036c0fd9801e8f95b6e0b0a6f904b57393adf75c81e2a"
    // generator
    //     :
    //     "9211698109297098287"
    // generatorPublicKey
    //     :
    //     "bf0ced0472d8ba3df9e21808e98e61b34404aad737e2bae1778cebc698b40f37"
    // generatorRS
    //     :
    //     "APL-NZKH-MZRE-2CTT-98NPZ"
    // height
    //     :
    //     99120
    // numberOfTransactions
    //     :
    //     0
    // payloadHash
    //     :
    //     "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    // payloadLength
    //     :
    //     0
    // previousBlock
    //     :
    //     "5374979919273547023"
    // previousBlockHash
    //     :
    //     "0f55283bc2c3974a166d4e8abf40f8edf23cfbcbb2743aab78be3df9732b4926"
    // timestamp
    //     :
    //     15745513
    // totalAmountATM
    //     :
    //     "0"
    // totalFeeATM
    //     :
    //     "0"
    // transactions
    //     :
    //     []
    // version
    //     :
    //     3

    render () {
        return (
            <tr>
                <td className="blue-link-text">
                    <a>{this.props.block.height}</a>
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