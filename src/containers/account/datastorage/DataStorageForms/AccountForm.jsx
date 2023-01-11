import React, { useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import AccountRS from '../../../components/account-rs';
import { useSearchParams } from './useSearchParams';

export const AccountForm = () => {
  const history = useHistory();
  const getParams = useSearchParams();

  const handleSubmit = ({ account }) => {
    if (!account) history.push('/data-storage'); 
    else history.push('/data-storage/account=' + account);
  }

  const formik = useFormik({
    initialValues: { account: getParams('account') }, 
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    formik.setFieldValue('account', getParams('account'));
  }, [getParams('account')]);

  return (
    <FormikProvider value={formik}>
      <Form className="input-group-app search col-md-3 pl-0">
        <div className="iconned-input-field form-group-app">
            <AccountRS
              placeholder='Account ID'
              noContactList
              name="account"
            />
            <button
                type='submit'
                className="input-icon"
                style={{
                    width: 41,
                    height: 40,
                }}
            >
                <i className="zmdi zmdi-search"/>
            </button>
        </div>
      </Form>
    </FormikProvider>
  );
}