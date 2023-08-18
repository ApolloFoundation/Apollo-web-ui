import React from 'react';
import { useFormikContext } from 'formik';
import CheckboxWithFormik from 'containers/components/check-button-input/CheckboxWithFormik';
import CustomTextArea from '../TextArea/TextAreaWithFormik';

export const MessageInputs = ({ idGroup }) => {
  const { values } = useFormikContext();

  if (!values.add_message) return (
    <CheckboxWithFormik
      name="add_message"
      label="Add a message?"
      id={`${idGroup}-add_message`}
      defaultValue={false}
    />
  );

  return (
    <>
      <CheckboxWithFormik
        name="add_message"
        label="Add a message?"
        id={`${idGroup}-add_message`}
        defaultValue={false}
      />
      <CustomTextArea
        label='Message'
        name='message'
        placeholder='Message'
      />
      <CheckboxWithFormik
        label='Encrypt Message'
        name='encrypt_message'
        id={`${idGroup}-encrypt_message-to-account`}
        defaultValue={false}
      />
      <CheckboxWithFormik
        label='Message is Never Deleted'
        name='permanent_message'
        id={`${idGroup}-permanent_message-to-account`}
        defaultValue={false}
      />
    </>
  );
}