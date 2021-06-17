import { NotificationManager } from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";

export const handleSendMessageFormSubmit = (values) => {
  return async (dispatch, getState) => {
    const { recipient, resetForm } = values;

    delete values.resetForm;

    if (
      !values.message ||
      values.message.length === 0 ||
      !/\S/.test(values.message)
    ) {
      NotificationManager.error("Please write your message.", "Error", 5000);
      return;
    }

    if (values.message.length > 100) {
      NotificationManager.error(
        "Message must not exceed 100 characters.",
        "Error",
        5000
      );
      return;
    }

    if (values.messageToEncrypt) {
      values = {
        ...values,
        messageToEncrypt: values.message,
      };
      delete values.message;
    }

    if (!values.secretPhrase) {
      NotificationManager.error("Enter secret phrase.", "Error", 5000);
      return;
    }

    const secretPhrase = JSON.parse(JSON.stringify(values.secretPhrase));
    // delete values.secretPhrase;

    const res = await dispatch(
      submitForm.submitForm(
        {
          ...values,
          recipient,
          secretPhrase,
          feeATM: 4,
        },
        "sendMessage"
      )
    );

    if (res && res.errorCode) {
      NotificationManager.error(res.errorDescription, "Error", 5000);
    } else if (res && !res.errorCode) {
      resetForm();
      NotificationManager.success("Message has been submitted!", null, 5000);
    }
    return;
  };
};
