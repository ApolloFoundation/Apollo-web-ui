import React from 'react';
import { connect } from 'react-redux';
import CustomButton from '../button';

const FormFooter = ({
  idGroup,
  submitButtonName,
  cancelButtonName,
  isPending,
  isDisabled,
  closeModal,
  isMomalProcessing,
  isClosing,
}) => (
  <div className="btn-box right-conner align-right form-footer">
    {!isClosing && (
      <CustomButton
        id={`${idGroup}cancel-button`}
        onClick={closeModal}
        className="mr-3"
        name={cancelButtonName ?? "Cancel"}
      />
    )}
    {submitButtonName && (
      <CustomButton
        type="submit"
        id={`${idGroup}cancel-button`}
        color="green"
        isLoading={isMomalProcessing || isPending}
        disabled={isDisabled || isMomalProcessing || isPending}
        className="mr-3"
        name={submitButtonName}
      />
    )}
  </div>
);

const mapStateToProps = state => ({ isMomalProcessing: state.modals.isMomalProcessing });

export default connect(mapStateToProps)(FormFooter);
