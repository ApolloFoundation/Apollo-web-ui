import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';
import React from 'react';

export const BlockDetails = ({blockInfo, decimals, formatTimestamp}) => (
  <div className="transaction-table no-min-height transparent">
  <div className="transaction-table-body transparent">
    <table>
      <tbody>
        <tr>
          <td>Previous Block Hash:</td>
          <td className="no-white-space break-word">{blockInfo.previousBlockHash}</td>
        </tr>
        <tr>
          <td>Payload Length:</td>
          <td className="no-white-space break-word">{blockInfo.payloadLength}</td>
        </tr>
        <tr>
          <td>Total Fee ATM:</td>
          <td className="no-white-space break-word">{bigIntFormat(bigIntDivision(blockInfo.totalFeeATM, decimals))}</td>
        </tr>
        <tr>
          <td>Generation Signature:</td>
          <td className="no-white-space break-word">{blockInfo.generationSignature}</td>
        </tr>
        <tr>
          <td>Executed Phased Transactions:</td>
          <td className="no-white-space break-word">{blockInfo.fullHash}</td>
        </tr>
        <tr>
          <td>Generator Public Key:</td>
          <td className="no-white-space break-word">{blockInfo.generatorPublicKey}</td>
        </tr>
        <tr>
          <td>Base Target:</td>
          <td className="no-white-space break-word">{blockInfo.baseTarget}</td>
        </tr>
        <tr>
          <td>Payload Hash:</td>
          <td className="no-white-space break-word">{blockInfo.payloadHash}</td>
        </tr>
        <tr>
          <td>Number of Transactions:</td>
          <td className="no-white-space break-word">{blockInfo.numberOfTransactions}</td>
        </tr>
        <tr>
          <td>Block Signature:</td>
          <td className="no-white-space break-word">{blockInfo.blockSignature}</td>
        </tr>
        <tr>
          <td>Version:</td>
          <td className="no-white-space break-word">{blockInfo.version}</td>
        </tr>
        <tr>
          <td>Total Amount ATM:</td>
          <td className="no-white-space break-word">{bigIntFormat(bigIntDivision(blockInfo.totalFeeATM, decimals))}</td>
        </tr>
        <tr>
          <td>Cumulative Difficulty:</td>
          <td className="no-white-space break-word">{blockInfo.cumulativeDifficulty}</td>
        </tr>
        <tr>
          <td>Block:</td>
          <td className="no-white-space break-word">{blockInfo.block}</td>
        </tr>
        <tr>
          <td>Height:</td>
          <td className="no-white-space break-word">{blockInfo.height}</td>
        </tr>
        <tr>
          <td>Timestamp:</td>
          <td className="no-white-space break-word">{blockInfo.timestamp}</td>
        </tr>
        <tr>
          <td>Generator:</td>
          <td className="no-white-space break-word">{blockInfo.generatorRS}</td>
        </tr>
        <tr>
          <td>Previous Block:</td>
          <td className="no-white-space break-word">{blockInfo.previousBlock}</td>
        </tr>
        <tr>
          <td>Block Generating Time:</td>
          <td>{formatTimestamp(blockInfo.timestamp)}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
)