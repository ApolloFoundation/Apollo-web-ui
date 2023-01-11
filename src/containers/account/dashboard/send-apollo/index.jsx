import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { ReactComponent as QrIcon } from '../../../../assets/qr-icon.svg';
import AccountRSForm from '../../../components/form-components/AccountRS';
import ContentLoader from '../../../components/content-loader';
import CustomInput from '../../../components/custom-input';
import Button from '../../../components/button';
import FeeInputForm from '../../../components/form-components/FeeInput/fee-input1';

export default function SendApollo() {
  const dispatch = useDispatch();

  const [actionType, setActionType] = useState(0);

  const { dashboardAccoountInfo } = useSelector(state => state.dashboard);

  const submitForm = useCallback(({
    type, recipient, amountATM, feeATM,
  }, { resetForm }) => {
    if (type === 'private') {
      dispatch(setBodyModalParamsAction('SEND_APOLLO_PRIVATE', {
        recipient, amountATM, feeATM,
      }));
      resetForm({});
    } else {
      dispatch(setBodyModalParamsAction('SEND_APOLLO', {
        recipient, amountATM, feeATM,
      }));
      resetForm({});
    }
  }, [dispatch]);

  return (
    <div className="card card-light w-100">
      <div className="card-title">
        <div className="title">Send Apollo</div>
      </div>
      <div className="card-body">
        <Formik
          initialValues={{
            amountATM: '',
            type: 'public',
            recipient: '',
            feeATM: 1,
          }}
          onSubmit={submitForm}
        >
          {({ setFieldValue, values }) => (
            <Form className="form-group-app d-flex flex-column justify-content-between h-100 mb-0">
              <div className="tabs-wrap mb-3">
                <div
                  className={`tab-item ${actionType === 0 ? 'active' : ''}`}
                  onClick={() => setActionType(0)}
                >
                  Send APL
                </div>
                <div
                  className={`tab-item ${actionType === 1 ? 'active' : ''}`}
                  onClick={() => setActionType(1)}
                >
                  Receive APL&nbsp;
                  <QrIcon />
                </div>
              </div>
              {actionType === 0 ? (
                <>
                  <div className="switch-wrap mb-3">
                    <div
                      className={`switch-item ${values.type !== 'private' ? 'active' : ''}`}
                      onClick={() => setFieldValue('type', 'public')}
                    >
                      <i className="zmdi zmdi-eye" />
                      &nbsp;Public
                    </div>
                    <div
                      className={`switch-item ${values.type === 'private' ? 'active' : ''}`}
                      onClick={() => setFieldValue('type', 'private')}
                    >
                      <i className="zmdi zmdi-eye-off" />
                      &nbsp;Private
                    </div>
                  </div>
                  <AccountRSForm
                    name="recipient"
                    label="Recipient"
                    placeholder="Recipient"
                  />
                  <CustomInput
                    name="amountATM"
                    label="Amount APL"
                    type="float"
                    placeholder="Amount"
                  />
                  <FeeInputForm
                    name="feeATM"
                    type="tel"
                    values={values}
                    disableArrows
                  />
                  <Button
                    type="submit"
                    name="Send Apollo"
                    className="btn"
                    color="green"
                    size="lg"
                    isArrow
                  />
                </>
              ) : (
                <div className="qr-code-wrap">
                  {dashboardAccoountInfo ? (
                    <>
                      <QRCode
                        className="qr-code mb-3"
                        value={dashboardAccoountInfo.accountRS}
                        size="100"
                      />
                      <CopyToClipboard
                        text={dashboardAccoountInfo.accountRS}
                        onCopy={() => {
                          NotificationManager.success('The account has been copied to clipboard.');
                        }}
                      >
                        <div className="wallet-id-wrap cursor-pointer">
                          {dashboardAccoountInfo.accountRS}
                        </div>
                      </CopyToClipboard>
                    </>
                  ) : (
                    <ContentLoader noPaddingOnTheSides />
                  )}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
