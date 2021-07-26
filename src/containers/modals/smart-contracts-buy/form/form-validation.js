import { NotificationManager } from "react-notifications";

export function validationForm(values) {
  let error = false;
  if (!values.fuelPrice || values.fuelPrice.length === 0) {
    NotificationManager.error("Fuel Price is required.", "Error", 5000);
    return (error = true);
  } else if (!values.fuelLimit || values.fuelLimit.length === 0) {
    NotificationManager.error("Fuel Price is required.", "Error", 5000);
    return (error = true);
  } else if (!values.secret || values.secret.length === 0) {
    NotificationManager.error("Secret phrase is required.", "Error", 5000);
    return (error = true);
  }
  return error;
}
