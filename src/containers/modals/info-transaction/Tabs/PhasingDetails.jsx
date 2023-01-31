import React from 'react';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';

const votingModel = {
  0: 'ACCOUNT',
  1: 'ACCOUNT BALANCE',
  2: 'ASSET BALANCE',
  3: 'CURRENCY BALANCE',
}

export const PhasingDetails = ({ whitelist, transaction }) => {
  const dispatch = useDispatch();

  const handleAccountIfno = (account) => () =>
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account));

  if (!transaction?.attachment || !transaction?.phased) return null;

  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent full-info">
          <table>
              <tbody>
              <tr>
                  <td>Phasing Finish Height:</td>
                  <td>{transaction.attachment.phasingFinishHeight}</td>
              </tr>
              <tr>
                  <td>Voting Model:</td>
                  <td>
                    {votingModel[transaction.attachment.phasingVotingModel]}
                  </td>
              </tr>
              <tr>
                  <td>Quorum:</td>
                  <td>{transaction.attachment.phasingQuorum}</td>
              </tr>
              <tr>
                  <td>Minimum Balance:</td>
                  <td>{transaction.attachment.phasingMinBalance}</td>
              </tr>
              <tr>
                  <td>Whitelist:</td>
                  <td>
                      <div className='transaction-table no-min-height'>
                          <div
                              className='transaction-table-body transparent no-border-top'>
                              <table>
                                  <thead>
                                  <tr>
                                      <td style={{
                                          padding: '20px 0 20px',
                                          border: 0
                                        }}
                                      >
                                        Account
                                      </td>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {
                                      whitelist?.map((el) => (
                                            <tr key={el.account}>
                                                <td className='blue-link-text'>
                                                    <a onClick={handleAccountIfno(el.account)}>
                                                        {el.accountRS}
                                                    </a>
                                                </td>
                                            </tr>
                                          )
                                      )
                                  }
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td>Minimum Balance Model:</td>
                  <td>{transaction.attachment.phasingMinBalanceModel === 0 && 'NONE'}</td>
              </tr>

              <tr>
                  <td>Full Hash:</td>
                  <td>{transaction?.attachment?.phasingWhitelist ?? '-'}</td>
              </tr>
              </tbody>
          </table>
      </div>
    </div>
  );
}