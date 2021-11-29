import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import {
  convertToATM,
  convertToToken,
} from "../../../../../helpers/converters";
import { processAccountRStoHex } from "apl-web-crypto";
import { exportReadMethod } from "../../../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../../../modules/modals";
import TextualInputComponent from "../../../../components/form-components/textual-input1";
import Button from "../../../../components/button";
import AccountRSForm from "../../../../components/form-components/account-rs1";
import fieldValidate from "./form-validation";

const ExplorerForm = ({
  fields,
  address,
  methodName: name,
  type,
  formIndex,
  token,
  id,
}) => {
  const dispatch = useDispatch();
  const [readMethods, setReadMethods] = useState([]);
  const [error, setError] = useState(null);
  const regAPL = /^APL/;
  const regAmount = /^amount/;

  const getInitialValues = (fields) => {
    const initialValues = {};
    fields.forEach((field) => (initialValues[field.name] = ""));
    return initialValues;
  };

  const onSubmitNonpayable = (values) => {
    const params = Object.keys(values)
      .map((key) => {
        if (regAPL.test(values[key])) {
          const parseRStoHex = processAccountRStoHex(values[key], true);
          return `'${parseRStoHex}'`;
        } else if (regAmount.test(key)) {
          return convertToATM(values[key]);
        }
        return values[key];
      })
      .join(",");

    dispatch(
      setBodyModalParamsAction("SMC_CALL", {
        address,
        name,
        params,
        formIndex,
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
                      render={({ field: { name } }) => {
                        return (
                          <div className="mb-3">
                            {item.type === "address" ? (
                              <AccountRSForm
                                id={`input-${id}`}
                                label={name}
                                name={name}
                                placeholder={name}
                              />
                              ) : (
                              <TextualInputComponent
                                id={`input-${id}`}
                                label={name}
                                name={name}
                                placeholder={name}
                                type={item.type === "uint" ? "float" : "text"}
                              />
                            )}
                            {errors[name] && touched[name] && (
                              <div className={"text-danger"}>
                                {errors[item.name]}
                              </div>
                            )}
                        </div>
                      )}}
                    />
                  ))}
                  <Button
                    id={`button-${id}`}
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
      {error && readMethods.length === 0 && (
        <div className={"text-danger"}>{error}</div>
      )}
      {readMethods.length > 0 &&
        readMethods.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="mb-1">Method: {item.method}</div>
            {item.signature && item.output && (
              <>
                <div className="mb-1">Signature: {item.signature}</div>
                <div className="mb-1">
                  <span className="text-info">
                    {convertToToken(item.output[0], 8, true)}&nbsp;
                  </span>
                  <span>
                    ({Number(item.output[0]).toLocaleString("en", {
                      useGrouping: true,
                    })})
                  </span>
                </div>
              </>
            )}
            {item.errorDescription && (
              <div className="mb-1 text-danger">
                Error description: {item.errorDescription}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
export default ExplorerForm;
