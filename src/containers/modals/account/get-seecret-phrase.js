/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import {
  setModalData, setModalType, setBodyModalParamsAction,
} from '../../../modules/modals';
import { setAccountPassphrase } from '../../../modules/account';
import { getForging } from '../../../actions/login';
import crypto from '../../../helpers/crypto/crypto';

import InfoBox from '../../components/info-box';
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';
import { CheckboxFormInput } from '../../components/form-components/check-button-input';
import { secureStorage } from '../../../helpers/format';

class PrivateTransactions extends React.Component {
  constructor(props) {
    super(props);

    this.state = { passphraseStatus: false };
  }

  async validatePassphrase(passphrase) {
    return await this.props.validatePassphrase(passphrase);
  }

    handleFormSubmit = async params => {
      const { passphrase } = params;

      if (params.isSavePassphrase) {
        secureStorage.setItem('secretPhrase', JSON.stringify(passphrase.toString()));
        delete params.isSavePassphrase;
      }

      this.props.setAccountPassphrase(passphrase);
      this.props.getForging();
      // this.props.setBodyModalParamsAction(null, null);

      this.props.closeModal();
    }

    render() {
      return (
        <ModalBody
          loadForm={this.loadForm}
          modalTitle="Confirm forging start"
          modalSubTitle="If you want to start forging, type your passphrase to confirm."
          closeModal={this.props.closeModal}
          handleFormSubmit={values => this.handleFormSubmit(values)}
          submitButtonName="Start forging"
          isDisableSecretPhrase
          nameModel={this.props.nameModal}
        >
          <InfoBox info>
            Your effective balance must be greater than 1000
            {' '}
            {this.props.ticker}
            {' '}
            to forge.
          </InfoBox>
          <TextualInputComponent
            field="passphrase"
            type="password"
            label="Secret Phrase"
            placeholder="Secret Phrase"
          />
          <CheckboxFormInput
            checkboxes={[
              {
                field: 'isSavePassphrase',
                handler: null,
                label: 'Keep forging?',
              },
            ]}
          />
        </ModalBody>
      );
    }
}

const mapStateToProps = state => ({
  publicKey: state.account.publicKey,
  ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
  setModalData: data => dispatch(setModalData(data)),
  setModalType: passphrase => dispatch(setModalType(passphrase)),
  setBodyModalParamsAction: passphrase => dispatch(setBodyModalParamsAction(passphrase)),
  validatePassphrase: passphrase => dispatch(crypto.validatePassphrase(passphrase)),
  setAccountPassphrase: passphrase => dispatch(setAccountPassphrase(passphrase)),
  getForging: reqParams => dispatch(getForging(reqParams)),

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateTransactions);
