import React from 'react';
import { useSelector } from 'react-redux';
import { get2FASelector } from 'selectors';
import AccountRSFormInput from "containers/components/form-components/AccountRS";
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';

export const ExportAccountForm = () => {
  const is2FA = useSelector(get2FASelector);
  return (
    <>
       <AccountRSFormInput
          name='account'
          label='Account ID'
          placeholder='Account ID'
      />
      <CustomInput
          label='Secret phrase'
          name="passPhrase"
          placeholder="Secret phrase"
          type="password"
      />
      {is2FA && (
          <CustomInput
              label='2FA code'
              name="code2FA"
              placeholder="2FA code"
              type="password"
          />
      )}
    </>
  )
}