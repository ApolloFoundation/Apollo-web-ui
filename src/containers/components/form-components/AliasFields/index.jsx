import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import AccountRSFormInput from 'containers/components/form-components/AccountRS';
import CustomInputWithFormik from 'containers/components/custom-input/CustomInputWithFormik';

const input = {
  uri: (
      <CustomInputWithFormik
          label='URI'
          name="aliasURI"
          placeholder="http://"
          type="text"
      />
  ),
  account: <AccountRSFormInput name='aliasURI' label='Account ID' />,
  general: (<CustomInputWithFormik
          label='Data'
          name="aliasURI"
          placeholder="Data"
          type="text"
      />
  )
}

export const AliasFields = ({ alias }) => {
  const { values, setFieldValue } = useFormikContext();
    
  useEffect(() => {
      setFieldValue('aliasURI', alias?.aliasURI);
  }, [alias?.aliasURI, setFieldValue]);
  
  return input[values.type]
};
