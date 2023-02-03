/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import InfoBox from 'containers/components/info-box';
import ButtonTabs from 'containers/components/button-tabs';
import ErrorWrapper from './ErrorWrapper';
import { FileForm } from './FileForm';
import { SecretKeyForm } from './SecretKeyForm';
import styles from './index.module.scss';

const formats = {
  file: 'file',
  text: 'text'
}

const tabs = [
  {
    label: 'Secret file',
    id: formats.file,
  },
  {
    label: 'Secret key',
    id: formats.text,
  },
];

export default function ImportAccount({ account, handleClose }) {
  const [format, setFormat] = useState(formats.file);

  const handleTab = useCallback(currentTab => setFormat(currentTab), []);

  useEffect(() => {
    if (account) {
      handleClose();
    }
  }, [account, handleClose]);

  return (
    <ErrorWrapper>
      <div className={classNames("dark-card", styles.importAccountWrapper)}>
        <span
          onClick={handleClose}
          className="exit"
        >
          <i className="zmdi zmdi-close" />
        </span>
        <p className="title">Import Account</p>
        <div className="form-tabulator">
          <ButtonTabs
            tabs={tabs}
            onClick={handleTab}
            isActive={format}
          />
          <InfoBox className="dark-info">
            <ul className="marked-list">
              <li className="danger-icon">
                {format !== 'file'
                  ? <span>Please note that after import of the secret key the usage of the same vault wallet on different nodes will cause creation of different ETH, PAX, BTC wallets for each node.</span>
                  : <span>Please enter your account secret file. The file should have the .apl extension. If not,  add .apl to the file name manually please.</span>}
              </li>
            </ul>
          </InfoBox>
          {format === formats.file && <FileForm handleClose={handleClose} />}
          {format === formats.text && <SecretKeyForm handleClose={handleClose} />}
        </div>
      </div>
    </ErrorWrapper>
  );
}
