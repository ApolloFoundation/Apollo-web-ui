import { NotificationManager } from "react-notifications";

export function validationForm(values) {
  let error = false;
  if (!values.secretPhrase || values.secretPhrase.length === 0) {
    NotificationManager.error("Secret Phrase is required.", "Error", 5000);
    return (error = true);
  } else if (!values.source || values.source.length === 0) {
    NotificationManager.error("Contract is required.", "Error", 5000);
    return (error = true);
  } else if (!values.name || values.name.length === 0) {
    NotificationManager.error("Call method is required.", "Error", 5000);
    return (error = true);
  }  else if (!values.fuelPrice || values.fuelPrice.length === 0) {
    NotificationManager.error("Fuel Price is required.", "Error", 5000);
    return (error = true);
  } else if (!values.fuelLimit || values.fuelLimit.length === 0) {
    NotificationManager.error("Fuel Limit is required.", "Error", 5000);
    return (error = true);
  }
  return error;
}