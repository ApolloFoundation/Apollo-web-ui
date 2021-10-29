import React from "react";
import { useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import {
  addContractEventDataAction,
  addContractEventInfoAction,
  addEventAction,
} from "../../../actions/smart-contracts";
import TextualInputComponent from "../../../containers/components/form-components/textual-input1";
import Button from "../../../containers/components/button";
import validationShema from "./validationShema";

const initialState = {
  eventName: "",
  filter: "",
  fromBlock: 0,
  signature: "",
  description: "",
};

const ContractItemForm = ({ contractInstanse, contractId }) => {
  const dispatch = useDispatch();

  const prepareData = ({ eventName, filter, signature, fromBlock }) => {
    const data = {
      name: eventName,
      signature,
      fromBlock,
    };

    if (filter.trim().length > 0) {
      data.filter = JSON.parse(filter);
    }

    return data;
  };

  const handleAddEvent = (values) => () => {
    const isValidForm = validationShema(values);
    if (!isValidForm) {
      const data = prepareData(values);

      const event = contractInstanse.addEvent(
        data,
        handleEventMessage,
        handleEventSubscription
      );
      dispatch(
        addEventAction(contractId, {
          ...event,
          description: values.description,
        })
      );
    }
  };

  const handleEventMessage = (err, data) => {
    dispatch(addContractEventDataAction(contractId, err || data));
  };

  const handleEventSubscription = (err, data) => {
    dispatch(addContractEventInfoAction(contractId, err || data));
  };

  const handleAddEventOnce = (values) => () => {
    const isValidForm = validationShema(values);
    if (!isValidForm) {
      const data = prepareData(values);

      const event = contractInstanse.addEventOnce(
        data,
        handleEventMessage,
        handleEventSubscription
      );
      dispatch(
        addEventAction(contractId, {
          ...event,
          description: values.description,
        })
      );
    }
  };

  const handleTestEvent = () => {
    contractInstanse.createTest(handleEventMessage, handleEventSubscription);
  };

  return (
    <Formik initialValues={initialState} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <h3>Add contract event</h3>
          <TextualInputComponent
            type="text"
            name="eventName"
            placeholder="Enter event name"
          />
          <TextualInputComponent
            type="text"
            name="signature"
            placeholder="Enter event signature"
          />
          <TextualInputComponent
            type="text"
            name="fromBlock"
            placeholder="From block"
          />
          <TextualInputComponent
            type="text"
            name="description"
            placeholder="description"
          />
          <div class="form-group mt-5 mb-15">
            <Field
              res
              rows="5"
              as="textarea"
              name="filter"
              placeholder="Enter filter conditions"
            />
          </div>
          <div className="d-flex flex-column flex-lg-row justify-content-lg-between">
            <Button
              type="button"
              color="green"
              name="Add event"
              className="mt-1 mb-1"
              size="sm"
              onClick={handleAddEvent(values)}
            />
            <Button
              type="button"
              color="green"
              size="sm"
              name="Add event once"
              className="mt-1 mb-1"
              size="sm"
              onClick={handleAddEventOnce(values)}
            />
            <Button
              type="button"
              color="green"
              size="sm"
              name="Add test event"
              className="mt-1 mb-1"
              size="sm"
              onClick={handleTestEvent}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default ContractItemForm;
