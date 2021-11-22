import { NotificationManager } from "react-notifications";

const errorsList = {
  secretPhrase: "Secret Phrase is required.",
  fuelPrice: "Fuel Price is required.",
  fuelLimit: "Fuel Limit is required.",
  name: "Call method is required.",
  address: "Contract is required."
};

export function validationForm(values, passPhrase) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if ((!value || value.length === 0) && errorsList[key]) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    } else if (key === "secretPhrase" && value != passPhrase) {
      NotificationManager.error("Incorrect SecretPhrase", "Error", 5000);
      return true;
    }
    return acc;
  }, false);
}
