/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import { v4 as uuidv4 } from "uuid";
import { getTokenList, getTokensForm } from "../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../modules/modals";
import TextualInputComponent from "../../components/form-components/textual-input1";
import Button from "../../components/button";
import fieldValidate from "./form/form-validation";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [formFieldsList, setFormFieldsList] = useState([]);

  const getStateTokenList = useCallback(async () => {
    const tokenList = await dispatch(getTokenList());
    if (tokenList) {
      setTokenList(tokenList.modules);
      setCurrentToken(tokenList.modules[0]);
    }
  }, [dispatch]);

  const getStateTokensForm = useCallback(
    async (currentToken) => {
      const stateInfo = await dispatch(getTokensForm(currentToken));
      if (stateInfo) {
        setFormFieldsList(stateInfo.members[0].inputs);
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

  const getInitialValues = (fields) => {
    const initialValues = {};
    fields.forEach((field) => (initialValues[field.name] = ""));
    return initialValues;
  };

  const submitForm = useCallback(
    (values) => {
      const isValidForm = fieldValidate(values);
      if (!isValidForm) {
        dispatch(
          setBodyModalParamsAction("SMC_APROVE_TOKEN", {
            params: values,
            token: currentToken,
          })
        );
      }
    },
    [dispatch]
  );

  const handleChangeToken = (e) => {
    setCurrentToken(e.target.value);
  };

  return (
    <div className="modal-box wide">
      {formFieldsList.length > 0 ? (
        <Formik
          onSubmit={submitForm}
          initialValues={getInitialValues(formFieldsList)}
        >
          {({ errors, touched }) => {
            return (
              <Form>
                <div className="modal-form">
                  <div className="form-group-app">
                    <a onClick={closeModal} className="exit">
                      <i className="zmdi zmdi-close" />
                    </a>
                    <div className="form-title">
                      <p>Create token</p>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex">
                        {tokenList.map((item) => (
                          <div
                            key={uuidv4()}
                            className="d-flex align-items-center"
                          >
                            <label
                              htmlFor="text"
                              className="mr-2 mb-0 d-flex align-items-center"
                            >
                              {item}
                              <Field
                                type="radio"
                                name="token"
                                value={item}
                                checked={item === currentToken}
                                onChange={handleChangeToken}
                                className="mr-3 d-inline-block"
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {formFieldsList.map((item) => (
                      <Field
                        name={item.name}
                        validate={(value) => fieldValidate(value, item.type)}
                        render={({ field: { name } }) => (
                          <div className="mb-3">
                            <TextualInputComponent
                              className={"text-capitalize"}
                              label={name}
                              name={name}
                              placeholder={name}
                              type={item.type === "uin" ? "float" : "text"}
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
      ) : (
        <div>Empty list</div>
      )}
    </div>
  );
}
