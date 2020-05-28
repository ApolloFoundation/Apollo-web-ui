/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */


import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { NotificationManager } from 'react-notifications';
import { Form, Text, TextArea } from 'react-form';
import {
  openPrevModal,
  saveSendModalState,
  setAlert,
  setBodyModalParamsAction,
  setModalData,
} from '../../../../modules/modals';
import InfoBox from '../../../components/info-box';
import InputForm from '../../../components/input-form';
import InputUpload from '../../../components/input-upload';
import crypto from '../../../../helpers/crypto/crypto';
import submitForm from '../../../../helpers/forms/forms';
import { getAccountDataAction } from '../../../../actions/login';
import { importAccountAction, importAccountActionViaFile } from '../../../../actions/account';

export default function ImportAccount(props) {
  const { account, handleClose } = props;

  const { isValidating, setIsValidating } = useState(false);
  const { format, setFormat } = useState('file');
  const { isGenerated, setIsGenerated } = useState(false);
  const { importAccount, setImportAccount } = useState(false);
  const { isPending, setIsPending } = useState(false);

  useEffect(() => {
    if (account) {
      handleClose();
    }
  }, [account, handleClose]);

  const handleFormSubmit = async values => {
    const {
      secretBytes, passPhrase, sender, deadline,
    } = values;

    let newImportAccount = null;
    if (format === 'text') {
      newImportAccount = await importAccountAction({
        secretBytes, sender, deadline,
      });
    } else if (format === 'file') {
      newImportAccount = await importAccountActionViaFile({
        passPhrase, sender, deadline,
      });
    }

    if (importAccount && importAccount.errorCode) {
      NotificationManager.error(importAccount.errorDescription, 'Error', 5000);
    } else if (format === 'text') {
      setIsGenerated(true);
      setImportAccount(newImportAccount);
    } else {
      NotificationManager.success('Your account imported successfully!', null, 5000);
      handleClose();
    }
  };

  const handleEnterAccount = ({ accountId, passphrase }) => {
    if (accountId !== importAccount.accountRS) {
      NotificationManager.error('Accounts do not match', 'Error', 5000);
      return;
    }
    if (passphrase !== importAccount.passphrase) {
      NotificationManager.error('Your entered secret phrase do not match the generated one', 'Error', 5000);
      return;
    }

    setIsPending(true);

    this.props.getAccountDataAction({ account: accountId });
  };


  const handleTab = (e, index) => {
    setFormat(index);
    setIsGenerated(false);
    setImportAccount(null);
  };

  useMemo(() => {
    if (this.state.hasError) {
      return (<h2>Oops something went wrong. Please reload page</h2>);
    }
    return (
      <div className="dark-card">
        <a onClick={this.props.handleClose} className="exit">
          <i className="zmdi zmdi-close" />
        </a>
        {!this.state.isValidating
            && (
            <Form
              onSubmit={values => this.handleFormSubmit(values)}
              render={({ submitForm, values, addValue }) => (
                <form
                  onChange={() => this.props.saveSendModalState(values)}
                  onSubmit={submitForm}
                >
                  <p className="title">Import Account</p>
                  <div className="form-tabulator">
                    <div className="form-tab-nav-box">
                      <a
                        onClick={e => this.handleTab(e, 'file')}
                        className={classNames({
                          'form-tab': true,
                          active: this.state.format === 'file',
                        })}
                      >
                        <p>Secret file</p>
                      </a>
                      <a
                        onClick={e => this.handleTab(e, 'text')}
                        className={classNames({
                          'form-tab': true,
                          active: this.state.format === 'text',
                        })}
                      >
                        <p>Secret key</p>
                      </a>
                    </div>
                    <InfoBox className="dark-info">
                      <ul className="marked-list">
                        <li className="danger-icon">
                          {this.state.format !== 'file'
                            ? (<span>Please note that after import of the secret key the usage of the same vault wallet on different nodes will cause creation of different ETH, PAX, BTC wallets for each node.</span>)
                            : (<span>Please enter your account secret file. The file should have the .apl extension. If not,  add .apl to the file name manually please.</span>)}
                        </li>
                      </ul>
                    </InfoBox>
                    {this.state.format !== 'file' ? (
                      <div className="form-group row form-group-grey mb-15">
                        <label>
                          Your account secret key
                        </label>
                        <TextArea
                          className="form-control"
                          placeholder="Secret Key"
                          field="secretBytes"
                          cols="30"
                          rows="3"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="form-group row form-group-white mb-15">
                          <label>
                            Your account secret phrase
                          </label>
                          <Text
                            className="form-control"
                            type="password"
                            field="passPhrase"
                            placeholder="Secret Phrase"
                          />
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                          <label>
                            Your account secret file
                          </label>
                          <InputUpload accept=".apl" id="file" />
                        </div>
                      </>
                    )}
                    {this.state.importAccount && (
                    <InfoBox attentionLeft className="dark-info">
                      <p className="mb-3">
                        Account ID:
                        {' '}
                        <span
                          className="itatic"
                        >
                          {this.state.importAccount.accountRS}
                        </span>
                      </p>
                      <p className="mb-3">
                        Secret Phrase:
                        {' '}
                        <span
                          className="itatic"
                        >
                          {this.state.importAccount.passphrase}
                        </span>
                      </p>
                      <CopyToClipboard
                        text={
                            `Account ID: ${this.state.importAccount.accountRS}\n`
                            + `Secret Phrase: ${this.state.importAccount.passphrase}\n`
                          }
                        onCopy={() => {
                          NotificationManager.success('The account data has been copied to clipboard.');
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-sm"
                        >
                          Copy account data to clipboard.
                        </button>
                      </CopyToClipboard>
                    </InfoBox>
                    )}
                    {this.state.importAccount && (
                    <InfoBox className="dark-info">
                      <ul className="marked-list">
                        <li className="danger-icon">
                          <strong>Remember</strong>
                          {' '}
                          to store your Account ID,
                          passphrase, and Secret Key in a secured place.
                          Make sure to write down this passphrase and store it
                          securely (the passphrase is order and case sensitive). This
                          passphrase is needed to use your wallet.
                        </li>
                      </ul>
                    </InfoBox>
                    )}
                    <div className="btn-box">
                      {!this.state.isGenerated
                        && (
                        <button
                          type="submit"
                          name="closeModal"
                          className="btn"
                        >
                          Restore account
                        </button>
                        )}
                      {this.state.isGenerated
                      && (
                      <button
                        type="button"
                        onClick={this.props.handleClose}
                        name="closeModal"
                        className="btn"
                      >
                        Close
                      </button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            />
            )}
        {
              this.state.isValidating
              && (
                <div className="modal-form">
                  <Form
                    onSubmit={this.handleEnterAccount}
                    render={({
                      submitForm, setValue, values, getFormState,
                    }) => (
                      <form
                        className={classNames({
                          'tab-body': true,
                          active: this.state.format === 0,
                        })}
                        onSubmit={submitForm}
                      >
                        <div className="form-group-app">
                          <div className="form-title">
                            <p>Restore Your Wallet</p>
                          </div>
                          <div className="form-group row form-group-white mb-15">
                            <label className="col-sm-3 col-form-label">
                              Account
                            </label>
                            <div className="col-sm-9">
                              <InputForm
                                type="text"
                                field="account"
                                placeholder="Account ID"
                                setValue={setValue}
                              />
                            </div>
                          </div>
                          <div className="form-group row form-group-white mb-15">
                            <label className="col-sm-3 col-form-label">
                              Secret phrase
                            </label>
                            <div className="col-sm-9">
                              <InputForm
                                isPlain
                                type="password"
                                field="passphrase"
                                placeholder="Secret Phrase"
                                setValue={setValue}
                              />
                            </div>
                          </div>
                          <div className="btn-box">
                            <button
                              style={{ width: 121.5 }}
                              type="submit"
                              name="closeModal"
                              className="btn"
                            >
                              Confirm restore
                            </button>
                            {this.state.isPending
                              ? (
                                <div
                                  style={{ width: 121.5 }}
                                  className="btn"
                                >
                                  <div className="ball-pulse">
                                    <div />
                                    <div />
                                    <div />
                                  </div>
                                </div>
                              )
                              : (
                                <button
                                  type="submit"
                                  name="closeModal"
                                  className="btn"
                                >
                                  Create new Account
                                </button>
                              )}
                          </div>
                        </div>
                      </form>
                    )}
                  />
                </div>
              )
        }
      </div>
    );
  }, []);
}
