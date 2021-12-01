import { NotificationManager } from 'react-notifications';

export const fieldValidate = (value, type) => {
  const hexaRegExp = /0x[0-9a-fA-F]+/i;
  const rsRegExp = /APL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}/i;

  let error;
  if (!value) {
    error = "Required";
  } else if (type === "address" && !rsRegExp.test(value) && !hexaRegExp.test(value)) {
    error = "Field not valid";
  } else if (type === "uint" && parseFloat(value) < 0.00000001) {
    error = "Field should be numeric and have a minimum 0.00000001 value.";
  }
  return error;
};

export const validationForm = (values) => {
  if (Number(values.initialSupply) > Number(values.cap)) {
    NotificationManager.error("Initial supply can't be greater then Cap", "Error", 5000);
    return true;
  }
  return false;
}
