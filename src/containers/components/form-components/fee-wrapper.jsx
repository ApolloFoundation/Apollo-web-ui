import React from 'react';
import { useFormikContext } from "formik"
import FeeInput from "./FeeInput/fee-input1"

export const FeeWrapper = (props) => {
  const { values } = useFormikContext();
  return (
    <FeeInput {...props} values={values} />
  )
}
