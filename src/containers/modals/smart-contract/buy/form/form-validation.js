import { NotificationManager } from "react-notifications";

const errorsList = {
  secretPhrase: "Incorrect SecretPhrase",
  fuelPrice: "Fuel Price is required.",
  fuelLimit: "Fuel Limit is required.",
};

export function validationForm(values, passPhrase) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if ((!value || value.length === 0) && errorsList[key]) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    } else if (key === "secretPhrase" && value != passPhrase) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    }
    return acc;
  }, false);
}
