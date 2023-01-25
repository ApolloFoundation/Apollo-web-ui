/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { formatTransactionType, getPhasingTransactionVoters } from '../../../../actions/transactions';
import { getBlockAction } from '../../../../actions/blocks';
import { Tooltip } from '../../../../containers/components/tooltip';
import IconRed from '../../../../assets/red-triangle.svg';
import styles from './index.module.scss';


const mapStateToProps = state => ({
  constants: state.account.constants,
  decimals: state.account.decimals,
});

const mapDispatchToProps = dispatch => ({
  setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getBlockAction: data => dispatch(getBlockAction(data)),
  formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

class Transaction extends React.Component {
    state = {
      phasing: null,
      transaction: null,
    };

    componentDidMount() {
      if (this.props.phased) {
        this.getPhasingTransactionInfo();
      }
    }

    componentDidUpdate() {
      if (this.props.transaction !== this.state.transaction) {
        this.getPhasingTransactionInfo();
      }
    }

    getPhasingTransactionInfo = async () => {
      const phasing = await getPhasingTransactionVoters({ transaction: this.props.transaction });

      if (phasing) {
        this.setState({
          phasing: phasing.polls[0],
          transaction: this.props.transaction,
        });
      }
    };

    async getBlock(type, blockHeight) {
      const requestParams = { height: blockHeight };

      const block = await this.props.getBlockAction(requestParams);

      if (block) {
        this.props.setBodyModalParamsAction('INFO_BLOCK', block);
      }
    }

    handleMouseOver = selector => {
      const el = document.querySelector(`[data-transaction="${selector}"]`);
      if (el) {
        el.classList.add('active');
      }
    };

    handleMouseOut = selector => {
      const el = document.querySelector(`[data-transaction="${selector}"]`);

      if (el) {
        el.classList.remove('active');
      }
    };

    render() {
      const {
        isUnconfirmed, timestamp, confirmations, amountATM,
        feeATM, sender, senderRS, recipient, recipientRS,
        height, formatTimestamp, transaction, type, constants,
        setBodyModalParamsAction, subtype, attachment, decimals, errorMessage,
      } = this.props;
      const transactionType = constants.transactionTypes && constants.transactionTypes[type];
      const { phasing } = this.state;
      return (
        <tr>
          {constants && (
            <>
              <td className={classNames("blue-link-text", styles.transactionDate)}>
                <a
                  className={styles.transactionDateLink}
                  onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', this.props, (type === 0 && subtype === 1))}
                >
                  {formatTimestamp(timestamp)}
                </a>
                {errorMessage && (
                  <div onClick={() =>  this.props.setBodyModalParamsAction('TRANSACTION_FAIL', this.props)}>
                    <Tooltip icon={IconRed}>
                      <div>
                        Transaction FAIL
                      </div> 
                    </Tooltip>
                  </div>
                )}
              </td>
              <td>
                {!!transactionType && (
                  (transactionType.subtypes[subtype].name === 'AliasSell' && amountATM === '0' && attachment.priceATM === '0')
                    ? formatTransactionType('AliasTransfer')
                    : formatTransactionType(transactionType.subtypes[subtype].name)
                )}
              </td>
              <td className="align-right">
                {
                  (amountATM === '0' && attachment.priceATM && attachment.priceATM !== '0')
                    ? attachment.priceATM / decimals
                    : amountATM / decimals
                }
              </td>
              <td className="align-right">
                {feeATM / decimals}
              </td>
              <td className="blue-link-text">
                <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', sender)}>
                  {senderRS}
                </a>
                &nbsp;
                &nbsp;
                <i className="zmdi zmdi-long-arrow-right" />
                &nbsp;
                &nbsp;
                <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', recipient)}>
                  {recipientRS}
                </a>
              </td>
              <td className="align-right phasing">

                {phasing && (
                <div
                  className="phasing-box"
                  style={{ zIndex: 12 }}
                  data-custom-at="top"
                  data-cat-id={JSON.stringify({ ...this.props.transaction, ...phasing })}
                >
                  <spna className="phasing-box__icon">
                    <i className="zmdi zmdi-accounts-alt" />
                  </spna>
                                &nbsp;
                                &nbsp;
                  <span className="phasing-box__result">
                    {phasing.result}
                    {' '}
                    /
                    {phasing.approved ? phasing.result : phasing.quorum}
                  </span>
                </div>
                )}
              </td>

              <td className="align-right blue-link-text">
                {!isUnconfirmed ? (
                  <a onClick={this.getBlock.bind(this, 'INFO_BLOCK', height)}>
                    {height}
                  </a>
                ) : (
                  <span>---</span>
                )}
              </td>
              <td className="align-right blue-link-text">
                {confirmations}
              </td>
            </>
          )}
        </tr>
      );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
