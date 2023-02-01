import React from 'react';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';

export const TransactionDetails = ({ transaction, decimals, parsedSignatures }) => {
  const formatTimestamp = useFormatTimestamp();
  
  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent full-info">
          <table>
              <tbody>
              {(transaction?.errorMessage) && (
                  <tr>
                      <td>
                          Error message:
                      </td>
                      <td>
                          {transaction?.errorMessage ?? '-'}
                      </td>
                  </tr>
              )}
              <tr>
                  <td>

                  </td>
              </tr>
              <tr>
                  <td>Sender public key:</td>
                  <td>{transaction.senderPublicKey}</td>
              </tr>
              <tr>
                <td>Signature:</td>
                <td className='no-white-space'>
                  {parsedSignatures &&
                    parsedSignatures.map(signature => (
                    <React.Fragment key={signature}>
                      <span className='break-word'>{signature}</span>
                      <br /><br />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
              <tr>
                  <td>Fee ATM:</td>
                  <td>{transaction.feeATM / decimals}</td>
              </tr>
              <tr>
                  <td>Transaction index:</td>
                  <td>?</td>
              </tr>
              <tr>
                  <td>Confirmations:</td>
                  <td>{transaction.confirmations}</td>
              </tr>
              <tr>
                  <td>Full Hash:</td>
                  <td className='no-white-space break-word'>{transaction.fullHash}</td>
              </tr>
              <tr>
                  <td>Type:</td>
                  <td>{transaction.type}</td>
              </tr>
              <tr>
                  <td>Subtype:</td>
                  <td>{transaction.subtype}</td>
              </tr>
              <tr>
                  <td>Version:</td>
                  <td>{transaction.version}</td>
              </tr>
              <tr>
                  <td>Phased:</td>
                  <td>{transaction.phased ? 'true' : 'false'}</td>
              </tr>
              <tr>
                  <td>EC block id:</td>
                  <td className='no-white-space break-word'>{transaction.ecBlockId}</td>
              </tr>
              <tr>
                  <td>Signature hash:</td>
                  <td className='no-white-space'>
                    <span className='break-word'>{transaction.signatureHash}</span>
                  </td>
              </tr>

              <tr>
                  <td>Sender RS:</td>
                  <td>{transaction.senderRS}</td>
              </tr>
              {
                  transaction.recipientRS &&
                  <tr>
                      <td>Recipient RS:</td>
                      <td>{transaction.recipientRS}</td>
                  </tr>
              }
              {
                  transaction.amountATM &&
                  <tr>
                      <td>Amount ATM:</td>
                      <td>
                            {(transaction.amountATM === "0" && transaction.attachment.priceATM) ?
                                transaction.attachment.priceATM : transaction.amountATM
                            }
                      </td>
                  </tr>
              }
              <tr>
                  <td>Sender:</td>
                  <td>{transaction.senderRS}</td>
              </tr>
              <tr>
                  <td>EC block height:</td>
                  <td>{transaction.ecBlockHeight}</td>
              </tr>
              <tr>
                  <td>Block:</td>
                  <td>{transaction.block}</td>
              </tr>

              <tr>
                  <td>Block timestamp:</td>
                  <td>{transaction.blockTimestamp}</td>
              </tr>
              <tr>
                  <td>Transaction Time:</td>
                  <td>{transaction.blockTimestamp}</td>
              </tr>

              <tr>
                  <td>Block generation time:</td>
                  <td>{formatTimestamp(transaction.timestamp)}</td>
              </tr>

              <tr>
                  <td>Deadline:</td>
                  <td>{transaction.deadline}</td>
              </tr>
              <tr>
                  <td>Timestamp:</td>
                  <td>{transaction.timestamp}</td>
              </tr>
              <tr>
                  <td>Height:</td>
                  <td>{transaction.height ?? '-'}</td>
              </tr>
              </tbody>
          </table>
      </div>
  </div>
  );
}