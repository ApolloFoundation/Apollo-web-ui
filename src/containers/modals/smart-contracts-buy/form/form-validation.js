import { NotificationManager } from "react-notifications";

export function validationForm(values, passPhrase) {
  if (!values.fuelPrice || values.fuelPrice.length === 0) {
    NotificationManager.error("Fuel Price is required.", "Error", 5000);
    return true;
  } else if (!values.fuelLimit || values.fuelLimit.length === 0) {
    NotificationManager.error("Fuel Price is required.", "Error", 5000);
    return true;
  } else if (!values.secretPhrase || values.secretPhrase.length === 0) {
    if (values.secretPhrase !== passPhrase) {
      NotificationManager.error("Incorrect Secret Phrase", "Error", 5000);
      return true;
    }
    NotificationManager.error("Secret Phrase is required.", "Error", 5000);
    return true;
  }
  return false;
}
