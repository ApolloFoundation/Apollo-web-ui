/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import moment from "moment";
import { processAccountRStoHex } from "apl-web-crypto";
import { getTokenList, getTokensForm } from "../../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { convertToAPL } from "../../../../helpers/converters";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import NumericInput from "../../../components/form-components/numeric-input1";
import InputDate from "../../../components/input-date";
import Button from "../../../components/button";
import fieldValidate from "./form/form-validation";

const CreateToken = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [tokenList, setTokenList] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [formFieldsList, setFormFieldsList] = useState([]);
  const [token, setToken] = useState(1);
  const [apl, setApl] = useState(1);

  const getStateTokenList = useCallback(async () => {
    const { modules } = await dispatch(getTokenList("token"));
    if (modules) {
      setTokenList(modules);
      setCurrentToken(modules[0]);
    }
  }, [dispatch]);

  const getStateTokensForm = useCallback(
    async (currentToken) => {
      const { members } = await dispatch(getTokensForm(currentToken));
      if (members) {
        setFormFieldsList(members[0].inputs);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    getStateTokenList();
  }, [dispatch]);

  useEffect(() => {
    if (currentToken) {
      getStateTokensForm(currentToken);
    }
  }, [dispatch, currentToken]);

  const setInitialValues = (fields) => {
    return fields.reduce(
      (acc, field) => {
        acc[field.name] = field.name === "rate" ? 1 : "";
        return acc;
      },
      { atm: "", token: "" }
    );
  };

  const submitForm = useCallback(
    ({ atm, token, ...values }) => {
      const isValidForm = fieldValidate(values);
      if (!isValidForm) {
        Object.keys(values).map((key) => {
          if (/^APL/.test(values[key])) {
            const parseRStoHex = processAccountRStoHex(values[key], true);
            return (values[key] = parseRStoHex);
          } else if (/^\d+(?:[\.,]\d+)?$/.test(values[key])) {
            const parseNumToATM = convertToAPL(values[key]);
            return (values[key] = parseNumToATM);
          }
          return values[key];
        });
        dispatch(
          setBodyModalParamsAction("SMC_APROVE_TOKEN", {
            params: values,
            token: currentToken,
            type: "token",
          })
        );
      }
    },
    [dispatch, currentToken]
  );

  const handleChangeAPL = useCallback(
    (setFieldValue, value) => {
      setApl(value);
      if (value != 0 && token != 0) {
        setFieldValue("rate", convertToAPL(token) / convertToAPL(value));
      } else {
        setFieldValue("rate", 0);
      }
    },
    [token]
  );

  const handleChangeToken = useCallback(
    (setFieldValue, value) => {
      setToken(value);
      if (value != 0 && apl != 0) {
        setFieldValue("rate", convertToAPL(value) / convertToAPL(apl));
      } else {
        setFieldValue("rate", 0);
      }
    },
    [apl]
  );

  const handleChangeTokenType = (e) => {
    setCurrentToken(e.target.value);
  };

  return (
    <div className="modal-box wide">
      <Formik
        enableReinitialize
        onSubmit={submitForm}
        initialValues={setInitialValues(formFieldsList)}
      >
        {({ errors, touched, setFieldValue }) => {
          return (
            <Form>
              <div className="modal-form">
                <div className="form-group-app">
                  <button
                    type="button"
                    id="button-close-modal-create-token"
                    onClick={closeModal}
                    className="exit"
                  >
                    <i className="zmdi zmdi-close" />
                  </button>
                  <div className="form-title">
                    <p>Create token</p>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      {tokenList.map((item, index) => (
                        <div
                          key={item + index}
                          className="d-flex align-items-center"
                        >
                          <label
                            htmlFor="text"
                            className="mr-2 mb-0 d-flex align-items-center"
                          >
                            {item}
                          </label>
                          <Field
                            id={`check-box-${index}-create-token`}
                            type="radio"
                            name="token"
                            value={item}
                            checked={item === currentToken}
                            onChange={handleChangeTokenType}
                            className="mr-3 d-inline-block"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {formFieldsList.map((item, index) => {
                    if (item.name === "rate") {
                      return (
                        <div key={item + index}>
                          <div className="row w-100 m-0 justify-content-between align-items-center mb-3">
                            <div className="col-5 p-0">
                              <Field
                                key={"atm" + index}
                                name="atm"
                                render={() => (
                                  <NumericInput
                                    label="Amount APL"
                                    type="float"
                                    placeholder="1"
                                    name="atm"
                                    onChange={(value) =>
                                      handleChangeAPL(setFieldValue, value)
                                    }
                                  />
                                )}
                              />
                            </div>
                            <div className="col-auto">
                              <i class="zmdi zmdi-swap zmdi-hc-2x"></i>
                            </div>
                            <div className="col-5 p-0">
                              <Field
                                key={"token" + index}
                                name="token"
                                render={() => (
                                  <NumericInput
                                    label="Amount Token"
                                    type="float"
                                    name="token"
                                    placeholder="1"
                                    onChange={(value) =>
                                      handleChangeToken(setFieldValue, value)
                                    }
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <Field
                            key={item + index}
                            name={item.name}
                            render={({ field: { name } }) => (
                              <div className="mb-3">
                                <TextualInputComponent
                                  className={"text-capitalize"}
                                  label={name}
                                  name={name}
                                  placeholder={name}
                                  type="float"
                                  disabled
                                />
                              </div>
                            )}
                          />
                        </div>
                      );
                    }
                    return (
                      <Field
                        key={item + index}
                        name={item.name}
                        render={({ field: { name } }) => (
                          <div className="mb-3">
                            {item.type === "timestamp" ? (
                              <>
                                <InputDate
                                  label={name}
                                  selected={startDate}
                                  onChange={(date) => {
                                    setStartDate(date);
                                    setFieldValue(
                                      name,
                                      moment(date).toISOString()
                                    );
                                  }}
                                  name={name}
                                  showTimeSelect
                                  timeIntervals={1}
                                  timeFormat="HH:mm:ss"
                                  timeCaption="time"
                                  dateFormat="MMMM d, yyyy h:mm:ss aa"
                                />
                              </>
                            ) : (
                              <TextualInputComponent
                                className={"text-capitalize"}
                                label={name}
                                name={name}
                                placeholder={name}
                                type={item.type === "uint" ? "float" : "text"}
                              />
                            )}
                          </div>
                        )}
                      />
                    );
                  })}
                  <Button
                    id="button-create-token"
                    type="submit"
                    size="lg"
                    color="green"
                    name="Preview"
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default CreateToken;
