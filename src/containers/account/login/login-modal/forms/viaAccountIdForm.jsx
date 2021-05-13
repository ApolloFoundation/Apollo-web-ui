import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { getAccountDataAction } from 'actions/login';
import AccountRS from 'containers/components/account-rs/index';
import Button from 'containers/components/button';

export default function AccountIdForm({ activeTab }) {
  const dispatch = useDispatch();

  const enterAccount = useCallback(({ accountRS }) => {
    if (!accountRS || !accountRS.length) {
      NotificationManager.error('Account ID is required.', 'Error', 5000);
      return;
    }

    dispatch(getAccountDataAction({ account: accountRS }));
  }, [dispatch]);

  return (
    <Formik
      initialValues={{ accountRS: '' }}
      onSubmit={enterAccount}
    >
      <Form
        className={cn({
          'tab-body mt-4': true,
          active: !activeTab,
        })}
      >
        <div className="input-group-app user">
          <div>
            <label htmlFor="recipient">
              Enter your ID or choose from saved
            </label>
            <div>
              <div className="iconned-input-field">
                <AccountRS
                  name="accountRS"
                  placeholder="Account ID"
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          name="Initiate"
          className="btn"
        />
      </Form>
    </Formik>
  );
}
