import React, { useState } from "react";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import Button from "../../../components/button";
import { Form, Formik, Field } from "formik";
import fieldValidate from "./form-validation";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { useDispatch } from "react-redux";
import { exportReadMethod } from "../../../../actions/contracts";

const ExplorerForm = ({ fields, address, methodName: name, type }) => {
  const dispatch = useDispatch();

  const [readMetods, setReadMetods] = useState([]);
  const [error, setError] = useState(null);

  const getInitialValues = (fields) => {
    const initialValues = {};
    fields.forEach((field) => (initialValues[field.name] = ""));
    return initialValues;
  };

  const onSubmitNonpayable = (values) => {
    const params = Object.keys(values)
      .map((key) => values[key])
      .join(",");

    dispatch(
      setBodyModalParamsAction("SMC_CREATE", {
        address,
        name,
        params,
      })
    );
  };

  const onSubmitView = async (values) => {
    const fieldValues = [];

    Object.keys(values).map((key) => fieldValues.push(values[key]));

    const data = {
      address,
      members: [{
          function: name,
          input: fieldValues,
        }],
    };

    const responceReadMethod = await dispatch(exportReadMethod(data));
    
    if (responceReadMethod.errorCode) {
      setError(responceReadMethod.errorDescription);
    } else {
      setReadMetods(responceReadMethod.results);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Formik
          initialValues={getInitialValues(fields)}
          onSubmit={type === "view" ? onSubmitView : onSubmitNonpayable}
        >
          {({ errors, touched }) => {
            return (
              <>
                <Form>
                  {fields.map((item) => (
                    <Field
                      name={item.name}
                      validate={(value) => fieldValidate(value, item.type)}
                      render={({ field: { name } }) => (
                        <div className="mb-3">
                          <TextualInputComponent
                            label={name}
                            name={name}
                            placeholder={name}
                            type={item.type === "uint" ? "float" : "text"}
                          />
                          {errors[name] && touched[name] ? (
                            <div className={"text-danger"}>
                              {errors[item.name]}
                            </div>
                          ) : null}
                        </div>
                      )}
                    />
                  ))}

                  <Button
                    name="Submit"
                    className="w-25"
                    color="green"
                    type="submit"
                  />
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
      {error && !readMetods && <div className={"text-danger"}>{error}</div>}
      {readMetods.length > 0
        ? readMetods.map((item) => (
            <div className="mb-2">
              {item.method && <div className="mb-1">Method: {item.method}</div>}

              {item.signature && item.output && (
                <div className="mb-1">
                  Signature: {item.signature} {"->"}{" "}
                  <span className="text-info">{item.output[0]}</span>
                </div>
              )}
              {item.errorDescription && (
                <div className="mb-1 text-danger">
                  Error description: {item.errorDescription}
                </div>
              )}
            </div>
          ))
        : null}
    </div>
  );
};
export default ExplorerForm;
