import React from 'react';
import { connect } from 'react-redux';
import Button from '../button';

const FormFooter = ({
  idGroup,
  submitButtonName,
  isPending,
  isDisabled,
  closeModal,
  isMomalProcessing,
  isClosing,
}) => (
  <div className="btn-box right-conner align-right form-footer">
    {!isClosing && (
      <Button
        id={`${idGroup}cancel-button`}
        onClick={closeModal}
        className="mr-3"
        name="Cancel"
      />
    )}
    {submitButtonName && (
      <Button
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
