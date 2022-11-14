import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import classNames from 'classnames';
import { openPrevModal, saveSendModalState } from '../../../modules/modals';
import FormFooter from '../form-components/form-footer1';
import ModalFooter from '../modal-footer/index1';
import AdvancedSettings from '../advanced-transaction-settings';
import FeeInputForm from '../form-components/FeeInput/fee-input1';

export default function ModalBody(props) {
  const dispatch = useDispatch();

  const { modalData, modalsHistory } = useSelector(state => state.modals);
  const { decimals, ticker } = useSelector(state => state.account);

  const {
    handleFormSubmit, onChange, isPour, isXWide, isWide, initialValues,
  } = props;

  const handleSubmit = useCallback(values => {
    if (handleFormSubmit) {
      handleFormSubmit(values);
    }
  }, [handleFormSubmit]);

  const handleChange = useCallback(item => {
    dispatch(saveSendModalState(item.values));
    if (onChange) onChange(item);
  }, [dispatch, onChange]);

  const formContent = () => {
    const {
      CustomFooter, isDisableFormFooter, marketplace, isDisabledBackArrow,
      isAdvancedWhite, isDisableSecretPhrase, isDisabe2FA, modalSubTitle,
      idGroup, children, modalTitle, isPending, isDisabled, isClosingButton,
      isFee, closeModal, className, submitButtonName,
    } = props;

    const RightBar = marketplace
      ? p => <div className="right-bar">{p.children}</div>
      : React.Fragment;
    const isAdvanced = false;

    return (
      <Formik
        initialValues={{
          feeATM: (modalData && modalData.feeATM) || '1',
          ...initialValues,
        }}
        enableReinitialize
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        {({ values, getFormState }) => (
          <Form className={`${isPour ? '' : 'modal-form modal-send-apollo'} ${className}`}>
            <div className="form-group-app">
              <RightBar>
                {closeModal && !isPour && (
                  <button type="button" onClick={closeModal} className="exit">
                    <i className="zmdi zmdi-close" />
                  </button>
                )}
                {modalTitle && (
                  <div className="form-title">
                    {!isDisabledBackArrow && modalsHistory.length > 1 && (
                      <div
                        className="backMy"
                        onClick={() => {
                          dispatch(openPrevModal());
                        }}
                      />
                    )}
                    <p>{modalTitle}</p>
                  </div>
                )}
                {modalSubTitle && (
                  <div className="form-sub-title mb-4">{modalSubTitle}</div>
                )}
                {marketplace && (
                  <>
                    {marketplace.name && (
                    <div className="form-title">
                      {!isDisabledBackArrow && modalsHistory.length > 1 && (
                        <div
                          className="backMy"
                          onClick={() => {
                            dispatch(openPrevModal());
                          }}
                        />
                      )}
                      <p>{marketplace.name}</p>
                    </div>
                    )}
                    <div className="form-group mb-15">
                      <div className="top-bar">
                        <div
                          style={{ backgroundImage: `url(${marketplace.image})` }}
                          className={classNames({
                            'marketplace-image': true,
                            'no-image': !marketplace.hasImage,
                          })}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-15">
                      <label>
                        Price:
                      </label>
                      <div className="price">
                        {marketplace.priceATM / decimals}
                        {' '}
                        {ticker}
                      </div>
                    </div>
                    {marketplace.description && (
                    <div className="form-group mb-15">
                      <label>
                        Description:
                      </label>
                      <div>
                        {marketplace.description}
                      </div>
                    </div>
                    )}
                  </>
                )}
                {/** Passing props to each form component */}
                {React.Children.map(children, child => {
                  if (child) {
                    return React.cloneElement(child, { values });
                  }
                })}
                {isFee && (
                  <FeeInputForm
                    name="feeATM"
                    counterLabel={ticker}
                    values={values}
                  />
                )}
                {/** Rendering of secret phrase and 2fa fields */}
                {!isDisableSecretPhrase && (
                  <ModalFooter
                    off2FA={isDisabe2FA}
                    getFormState={getFormState}
                    values={values}
                    idGroup={idGroup}
                  />
                )}
                {isAdvanced && (
                  <AdvancedSettings
                    getFormState={getFormState}
                    values={values}
                    white={isAdvancedWhite}
                  />
                )}
                {/** Bottom forms buttons */}
                {!CustomFooter && !isDisableFormFooter && (
                  <FormFooter
                    submitButtonName={submitButtonName}
                    isPending={isPending}
                    isDisabled={isDisabled}
                    closeModal={closeModal}
                    isClosing={isClosingButton}
                    idGroup={idGroup}
                  />
                )}
                {!!CustomFooter && <CustomFooter />}
              </RightBar>
            </div>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    isPour
      ? formContent()
      : (
        <div className={`modal-box ${isWide ? 'wide' : ''} ${isXWide ? 'x-wide' : ''}`}>
          {formContent()}
        </div>
      )
  );
}
