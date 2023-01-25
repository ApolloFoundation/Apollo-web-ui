import React from 'react';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import {AccountRSWithFormik} from "../../../../components/account-rs/AccountRSWithFormik";

export const AccountForm = () => {
  const history = useHistory();

  const handleSubmit = (values) => {
    if (values && values.seller) {
        if (!values.seller.includes("_")) {
            history.push(`/marketplace/${values.seller}`);
        } else {
            NotificationManager.error('The account ID is incorrect.', 'Error', 5000);
        }
    }
  };

  return (
    <Formik onSubmit={handleSubmit} initialValues={{ seller: '' }}>
      <Form className="iconned-input-field">
        <AccountRSWithFormik
            name='seller'
            noContactList
            placeholder="Seller's Account ID"
        />
        <button type="submit" className="search-icon">
            <i className="zmdi zmdi-search" />
        </button>
      </Form>
    </Formik>
  )
}