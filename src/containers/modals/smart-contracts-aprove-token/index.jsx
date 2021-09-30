/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import AceEditor from "react-ace";
import { v4 as uuidv4 } from "uuid";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import {
  exportTestContract,
  exportContractSubmit,
  exportConfirmationOnBoard,
} from "../../../../src/actions/contracts";
import TextualInputComponent from "../../components/form-components/textual-input1";
import NumericInput from "../../components/form-components/numeric-input1";
import CheckboxFormInput from "../../components/check-button-input";
import Button from "../../components/button";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modals.modalData);
  const { accountRS, passPhrase: secretPhrase } = useSelector(
    (state) => state.account
  );
  const [fuelSwitcher, setFuelSwitcher] = useState(false);

  const handleChanegeFuelSwitcher = () => {
    setFuelSwitcher(!fuelSwitcher);
  };

  const sourceValue = (token, params) => {
    const convertedParams = Object.values(params).map((item) => `'${item}'`);
    return `class My${token} extends ${token} {
      constructor(){
          super(${convertedParams});
      }
    }`;
  };

  const submitForm = useCallback(
    async ({ advance, ...values }) => {
      let data = {
        name: `My${modalData.token}`,
        sender: accountRS,
        params: [],
        value: 0,
        ...values,
      };

      const testToken = await dispatch(exportTestContract(data));
      if (!testToken.errorCode) {
        const publishToken = await dispatch(exportContractSubmit(data));
        if (!publishToken.errorCode) {
          const boardToken = await dispatch(
            exportConfirmationOnBoard({ tx: publishToken.tx })
          );
          if (!boardToken.errorCode) {
            closeModal();
          }
        }
      }
    },
    [dispatch, modalData]
  );

  return (
    <div className="modal-box">
      {modalData ? (
        <Formik
          onSubmit={submitForm}
          initialValues={{
            fuelPrice: 100,
            fuelLimit: 300000000,
            source: sourceValue(modalData.token, modalData.params),
            secret: secretPhrase,
          }}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <div className="modal-form ">
                  <div className="form-group-app">
                    <button type="button" onClick={closeModal} className="exit">
                      <i className="zmdi zmdi-close" />
                    </button>
                    <div className="form-title">
                      <p>Token cretion preview</p>
                      <p>Token type: {modalData.token}</p>
                    </div>
                    <div className="transaction-table no-min-height transparent">
                      <div className="transaction-table-body transparent full-info">
                        <table>
                          <tbody>
                            {modalData &&
                              Object.entries(modalData.params).map(
                                ([key, value]) => (
                                  <tr key={uuidv4()}>
                                    <td className="text-capitalize">{key}</td>
                                    <td>{value}</td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mb-4">
                      <CheckboxFormInput
                        name="advance"
                        label="Advanced settings"
                        setValue={fuelSwitcher}
                        onChange={handleChanegeFuelSwitcher}
                      />
                    </div>
                    {fuelSwitcher && (
                      <div className="mb-2">
                        <NumericInput
                          label="Fuel price"
                          name="fuelPrice"
                          type="float"
                          defaultValue={0}
                        />
                        <NumericInput
                          label="Fuel limit"
                          name="fuelLimit"
                          type="float"
                          defaultValue={0}
                        />
                        <AceEditor
                          setOptions={{ useWorker: false }}
                          mode="javascript"
                          theme="tomorrow"
                          fontSize={14}
                          tabSize={2}
                          width="100%"
                          height="200px"
                          value={""}
                          name="source"
                          value={values["source"]}
                          onChange={(value) => setFieldValue("source", value)}
                        />
                      </div>
                    )}
                    <TextualInputComponent
                      label="Secret phrase"
                      type="password"
                      placeholder="Secret Phrase"
                      name="secret"
                      disabled
                    />
                    <Button
                      type="submit"
                      size="lg"
                      color="green"
                      name={"Publish"}
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
