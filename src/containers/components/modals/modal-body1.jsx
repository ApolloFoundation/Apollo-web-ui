import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import classNames from 'classnames';
import { ONE_APL } from '../../../constants';
import { openPrevModal, saveSendModalState } from '../../../modules/modals';
import FormFooter from '../form-components/form-footer';
import ModalFooter from '../modal-footer';
import AdvancedSettings from '../advanced-transaction-settings';
import BackForm from '../../modals/modal-form/modal-form-container';
import FeeInputForm from '../form-components/fee-input1';

export default function ModalBody(props) {
  const dispatch = useDispatch();

  const [newForm, setNewForm] = useState(null);

  const { modalData, modalsHistory } = useSelector(state => state.modals);

  const {
    loadForm, handleFormSubmit,
    onChange, isPour, isXWide, isWide,
  } = props;

  const loadValues = useCallback(values => {
    if (values) {
      newForm.setAllValues(values);
    } else if (modalsHistory[modalsHistory.length - 1] && modalsHistory[modalsHistory.length - 1].value) {
      newForm.setAllValues(modalsHistory[modalsHistory.length - 1].value);
    }
  }, [modalsHistory, newForm]);

  const getForm = useCallback(form => {
    if (loadForm) {
      loadForm(form);
    } else {
      setNewForm();
      loadValues();
    }
  }, [loadForm, loadValues]);

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
      idGroup, nameModel, children, modalTitle, isPending, isDisabled,
      isFee, closeModal, className, submitButtonName, isClosingButton,
    } = props;

    const RightBar = marketplace
      ? p => <div className="right-bar">{p.children}</div>
      : React.Fragment;
    const isAdvanced = false;

    return (
      <Formik
        initialValues={{ feeATM: (modalData && modalData.feeATM) || '1' }}
        getApi={value => getForm(value)}
        onChange={handleChange}
        onSubmit={values => handleSubmit(values)}
        nameModel={nameModel}
      >
        {({ values, getFormState }) => (
          <Form
            className={`${isPour ? '' : 'modal-form modal-send-apollo'} ${className}`}
          >
            <div className="form-group-app">
              <RightBar>
                {closeModal && !isPour && (
                  <span onClick={closeModal} className="exit">
                    <i className="zmdi zmdi-close" />
                  </span>
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
                        {marketplace.priceATM / ONE_APL}
                        {' '}
                        APL
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
                    values={values}
                    defaultValue={(modalData && modalData.feeATM) || '1'}
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
