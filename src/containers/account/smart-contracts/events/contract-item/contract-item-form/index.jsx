import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import {
  addContractEventDataAction,
  addContractEventInfoAction,
  addEventAction,
} from "../../../../../../actions/smart-contracts";
import { getSmcSpecification } from "../../../../../../actions/contracts";
import { validationForm } from "../../../../../../helpers/forms/contractValidator";
import TextualInputComponent from "../../../../../components/form-components/textual-input1";
import Button from "../../../../../components/button";
import CustomSelect from "../../../../../components/select";

const initialState = {
  eventName: "",
  filter: "",
  fromBlock: "",
  signature: "",
  description: "",
};

const ContractItemForm = ({ contractInstanse, contractId }) => {
  const dispatch = useDispatch();
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    getContractSpecification(contractId);
  }, [contractId]);

  const getContractSpecification = useCallback(async (id) => {
    const specList = await dispatch(getSmcSpecification(id));

    if(!specList) {
      return;
    }
    
    if (specList) {
      const membersList = specList.members.reduce((acc, item) => {
        if (item.type === "EVENT") {
          acc.push({
            label: item.name,
            value: item.signature,
          });
        }
        return acc;
      }, []);
        setEventList(membersList);
      }
    },
    [dispatch]
  );

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

  const handleAddEvent = (values, resetForm) => () => {
    const isValidForm = validationForm(values);
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
      resetForm();
    }
  };

  const handleEventMessage = (err, data) => {
    dispatch(addContractEventDataAction(contractId, err || data));
  };

  const handleEventSubscription = (err, data) => {
    dispatch(addContractEventInfoAction(contractId, err || data));
  };

  const handleAddEventOnce = (values, resetForm) => () => {
    const isValidForm = validationForm(values);
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
      resetForm();
    }
  };

  const handleTestEvent = () => {
    contractInstanse.createTest(handleEventMessage, handleEventSubscription);
  };

  const handleChangeDrop = (e, setFieldValue) => {
    setFieldValue("eventName", e.split(":")[0]);
    setFieldValue("signature", e);
  };


  return (
    <Formik initialValues={initialState} onSubmit={() => {}}>
      {({ values, setFieldValue, resetForm }) => (
        <Form>
          <h3 className="mb-3">Add contract event</h3>
          <CustomSelect
            options={eventList}
            className="mb-0"
            placeholder="Chose event name"
            onChange={(e) => handleChangeDrop(e, setFieldValue)}
          />
          <TextualInputComponent
            type="text"
            name="eventName"
            className="mb-0"
            placeholder="Enter event name"
          />
          <TextualInputComponent
            type="text"
            name="signature"
            className="mb-0"
            placeholder="Enter event signature"
          />
          <TextualInputComponent
            type="text"
            name="fromBlock"
            className="mb-0"
            placeholder="From block"
            type="float"
            limit={9}
          />
          <TextualInputComponent
            type="text"
            name="description"
            className="mb-15"
            placeholder="description"
          />
          <div class="form-group mt-15 mb-15">
            <Field
              className="mb-1"
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
              onClick={handleAddEvent(values, resetForm)}
            />
            <Button
              type="button"
              color="green"
              size="sm"
              name="Add event once"
              className="mt-1 mb-1"
              size="sm"
              onClick={handleAddEventOnce(values, resetForm)}
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
