import { NotificationManager } from "react-notifications";

const hexaRegExp = /0x[0-9a-fA-F]+/i;
const rsRegExp = /APL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}/i;

export function validationForm(values, passPhrase) {
  if (!values.secretPhrase || values.secretPhrase.length === 0) {
    if (values.secretPhrase !== passPhrase) {
      NotificationManager.error("Incorrect SecretPhrase", "Error", 5000);
      return true;
    }
    NotificationManager.error("Secret Phrase is required.", "Error", 5000);
    return true;
  } else if (!values.fuelPrice || values.fuelPrice.length === 0) {
    NotificationManager.error("Fuel Price source is required.", "Error", 5000);
    return true;
  } else if (!values.fuelLimit || values.fuelLimit.length === 0) {
    NotificationManager.error("Fuel Limit is required.", "Error", 5000);
    return true;
  } else if (!rsRegExp.test(values.sender) && !hexaRegExp.test(values.sender)) {
    NotificationManager.error("Payee not valid.", "Error", 5000);
    return true;
  } else if (!rsRegExp.test(values.token) && !hexaRegExp.test(values.token)) {
    NotificationManager.error("Token not valid.", "Error", 5000);
    return true;
  } else if (!rsRegExp.test(values.sender) && !hexaRegExp.test(values.sender)) {
    NotificationManager.error("Address not valid.", "Error", 5000);
    return true;
  }
  return false;
}
