import { useField } from 'formik';
import React from 'react';
import TextAreaBase from './';

const TextAreaWithFormik = ({name, ...props}) => {
  const [field] = useField(name);
  return <TextAreaBase {...props} {...field} name={name} />
}

export default TextAreaWithFormik;