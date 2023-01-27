import React, { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { setBodyModalParamsAction } from 'modules/modals';
import { getAccountRsSelector } from 'selectors';
import InfoBox from 'containers/components/info-box';
import styles from './index.module.scss';

export const AccountKeySeedData = forwardRef((
  { accountKeySeedData, downloadFile, closeModal },
  ref
) => {
  const dispatch = useDispatch();
  const account = useSelector(getAccountRsSelector);

  const handleDeleteModal = () => dispatch(setBodyModalParamsAction('DELETE_ACCOUNT_FROM_NODE', [
    {
        value: account,
        name: 'Account ID'
    },
    {
        value: accountKeySeedData,
        name: 'Secret File'
    }
  ]));

  if (!accountKeySeedData) return null;

  return (
    <>
      <InfoBox attentionLeft>
          <p className='mb-3'>
              Account ID: <span className={'itatic'}>{accountKeySeedData.account}</span>
          </p>
          <a
              ref={ref}
              href=''
              download={`${accountKeySeedData.account}.apl`}
              className="btn btn-green"
              target="_blank"
              rel="noopener noreferrer"
              onClick={downloadFile}
          >
              Download Secret File
          </a>
      </InfoBox>
      <InfoBox info nowrap>
          You can delete your account data from this web node completely.
          If you delete this account data you will need to import this secret key to
          login again.
          <br/>
          Do you want to delete it?
          <br/>
          <button
              type='button'
              onClick={handleDeleteModal}
              className={classNames('btn btn-danger', styles.button)}
          >
              Yes
          </button>
          <button
              type='button'
              onClick={closeModal}
              className={classNames('btn btn-green', styles.button)}
          >
              No
          </button>

      </InfoBox>
    </>
  );
});
