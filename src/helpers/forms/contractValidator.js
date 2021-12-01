import { NotificationManager } from "react-notifications";

const hexaRegExp = /0x[0-9a-fA-F]+/i;
const rsRegExp = /APL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}/i;

const errorsList = {
  secretPhrase: (value) => {
    if (!value || value.length === 0) {
      NotificationManager.error("Incorrect SecretPhrase", "Error", 5000);
      return true;
    }
  },
  fuelPrice: (value) => {
    if (!value || value.length === 0) {
      NotificationManager.error("Fuel Price is required.", "Error", 5000);
      return true;
    }
  },
  fuelLimit: (value) => {
    if (!value || value.length === 0) {
      NotificationManager.error("Fuel Limit is required.", "Error", 5000);
      return true;
    }
  },
  name: (value) => {
    if (!value || value.length === 0) {
      NotificationManager.error("Call method is required.", "Error", 5000);
      return true;
    }
  },
  address: (value) => {
    if (!value || value.length === 0) {
      NotificationManager.error("Contract is required.", "Error", 5000);
      return true;
    }
  },
  sender: (value) => {
    if (!value && !rsRegExp.test(value) && !hexaRegExp.test(value)) {
      NotificationManager.error("Incorrect Payee.", "Error", 5000);
      return true;
    }
  },
  token: (value) => {
    if (!value && !rsRegExp.test(value) && !hexaRegExp.test(value)) {
      NotificationManager.error("Incorrect Token.", "Error", 5000);
      return true;
    }
  },
  source: (value) => {
    if (!value && !rsRegExp.test(value) && !hexaRegExp.test(value)) {
      NotificationManager.error("Contract is required.", "Error", 5000);
      return true;
    }
  },
  contract: (value) => {
    if (!value && !rsRegExp.test(value) && !hexaRegExp.test(value)) {
      NotificationManager.error("Contract is required.", "Error", 5000);
      return true;
    }
  },
  signature: (value) => {
    if (!value || value.length === 0) {
      NotificationManager.error("Signature is required.", "Error", 5000);
      return true;
    }
  },
  value: (value) => {
    if (!value || parseFloat(value) < 0.00000001) {
      NotificationManager.error("Amount should be numeric and have a minimum 0.00000001 value.", "Error", 5000);
      return true;
    }
  },
  amount: (value) => {
    if (!value || parseFloat(value) < 0.00000001) {
      NotificationManager.error("Amount should be numeric and have a minimum 0.00000001 value.", "Error", 5000);
      return true;
    }
  },
};

export function validationForm(values) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    const validateValue = errorsList[key] && errorsList[key](value);
    return acc || validateValue;
  }, false);
}
