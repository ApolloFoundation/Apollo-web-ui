import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Form, Formik, Field } from "formik";
import { processAccountRStoHex } from "apl-web-crypto";
import { exportReadMethod } from "../../../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../../../modules/modals";
import TextualInputComponent from "../../../../components/form-components/textual-input1";
import Button from "../../../../components/button";
import fieldValidate from "./form-validation";

const ExplorerForm = ({ fields, address, methodName: name, type, formIndex }) => {
  const dispatch = useDispatch();

  const [readMethods, setReadMethods] = useState([]);
  const [error, setError] = useState(null);
  const regAPL = /^APL/;

  const getInitialValues = (fields) => {
    const initialValues = {};
    fields.forEach((field) => (initialValues[field.name] = ""));
    return initialValues;
  };

  const onSubmitNonpayable = (values) => {
    Object.keys(values).map((key) => {
      if (regAPL.test(values[key])) {
        const parseRStoHex = processAccountRStoHex(values[key], true);
        return (values[key] = `'${parseRStoHex}'`);
      }
      return values[key];
    });

    const params = Object.keys(values)
      .map((key) => values[key])
      .join(",");

    dispatch(
      setBodyModalParamsAction("SMC_CREATE", {
        address,
        name,
        params,
        formIndex
      })
    );
  };

  const onSubmitView = async (values) => {
    const fieldValues = Object.keys(values).map((key) => {
      if (regAPL.test(values[key])) {
        const parseRStoHex = processAccountRStoHex(values[key], true);
        return `'${parseRStoHex}'`;
      }
      return values[key];
    });

    const data = {
      address,
      members: [
        {
          function: name,
          input: fieldValues,
        },
      ],
    };

    const responceReadMethod = await dispatch(exportReadMethod(data));

    if (responceReadMethod.errorCode) {
      setError(responceReadMethod.errorDescription);
      setReadMethods([]);
    } else {
      setReadMethods(responceReadMethod.results);
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
      {error && readMethods.length == 0 && (
        <div className={"text-danger"}>{error}</div>
      )}
      {readMethods.length > 0
        ? readMethods.map((item) => (
            <div key={uuidv4()} className="mb-2">
              {item.method && <div className="mb-1">Method: {item.method}</div>}

              {item.signature && item.output && (
                <div className="mb-1">
                  Signature: {item.signature} {"-> "}
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
