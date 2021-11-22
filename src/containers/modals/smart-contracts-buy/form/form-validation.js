import { NotificationManager } from "react-notifications";

export function validationForm(values, passPhrase) {
  if (!values.fuelPrice || values.fuelPrice.length === 0) {
    NotificationManager.error("Fuel Price is required.", "Error", 5000);
    return true;
  } else if (!values.fuelLimit || values.fuelLimit.length === 0) {
    NotificationManager.error("Fuel Price is required.", "Error", 5000);
    return true;
  } else if (values.secretPhrase != passPhrase) {
    NotificationManager.error("Incorrect SecretPhrase", "Error", 5000);
    return true;
  }
  return false;
}
