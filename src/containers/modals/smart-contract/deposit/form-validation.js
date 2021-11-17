import { NotificationManager } from "react-notifications";

export function validationForm(values) {
  if (!values.secretPhrase || values.secretPhrase.length === 0) {
    NotificationManager.error("Secret Phrase is required.", "Error", 5000);
    return true;
  } else if (!values.fuelPrice || values.fuelPrice.length === 0) {
    NotificationManager.error("Fuel Price source is required.", "Error", 5000);
    return true;
  } else if (!values.fuelLimit || values.fuelLimit.length === 0) {
    NotificationManager.error("Fuel Limit is required.", "Error", 5000);
    return true;
  } else if (!values.address || values.address.length === 0) {
    NotificationManager.error("Recipient is required.", "Error", 5000);
    return true;
  }
  return false
}
