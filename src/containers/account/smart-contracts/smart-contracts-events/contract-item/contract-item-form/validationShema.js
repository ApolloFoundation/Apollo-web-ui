import { NotificationManager } from "react-notifications";

const validationShema = (values) => {
  let error = false;
  if (!values.signature || values.signature.length === 0) {
    NotificationManager.error("Signature is required.", "Error", 5000);
    return (error = true);
  }
  return error;
};
export default validationShema;
