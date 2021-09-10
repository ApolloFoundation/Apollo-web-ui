/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { validationForm } from "./form/form-validation";
import { parseTextFile } from "../../../../helpers/parseFile";
import {
  exportTestContract,
  exportContractSubmit,
  exportConfirmationOnBoard,
} from "../../../../../src/actions/contracts";
import { setBodyModalParamsAction } from "../../../../modules/modals";

import SiteHeader from "../../../components/site-header";
import NumericInput from "../../../components/form-components/numeric-input1";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import InputUpload from "../../../components/input-upload";
import Button from "../../../components/button";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";

const INITIAL_FORM_DATA = {
  name: "",
  params: "",
  value: 0,
  fuelPrice: 0,
  fuelLimit: 0,
  source: "",
};
export default function SmartContracts() {
  const dispatch = useDispatch();
  const {
    accountRS,
    passPhrase: secretPhrase,
    ticker,
  } = useSelector((state) => state.account);

  const [formContarctData, setFormContractData] = useState(null);
  const [isPublish, setIsPublish] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [pending, setPending] = useState({
    test: false,
    publish: false,
  });

  const handleValidationFormSubmit = async (values) => {
    const isValidForm = validationForm(values);

    if (!isValidForm) {
      const data = {
        ...values,
        value: Number(values.value) * Math.pow(10, 8),
        params: values.params.split(","),
      };
      setPending((state) => ({ ...state, test: true }));
      const testContract = await dispatch(exportTestContract(data));
      setPending((state) => ({ ...state, test: false }));
      if (testContract.errorCode) {
        setError(testContract);
      } else {
        setIsValidated(true);
        setFormContractData(data);
        setError(null);
      }
    }
  };

  const handlePublickFormSubmit = async (value, { resetForm }) => {
    if (!isPublish) {
      setPending((state) => ({ ...state, publish: true }));
      const publishContract = await dispatch(
        exportContractSubmit(formContarctData)
      );
      if (publishContract.errorCode) {
        setError(publishContract);
        setPending((state) => ({ ...state, publish: false }));
      } else {
        const boadContarct = await dispatch(
          exportConfirmationOnBoard({ tx: publishContract.tx })
        );
        if (boadContarct.errorCode) {
          setError(boadContarct);
        } else {
          setIsPublish(true);
          dispatch(
            setBodyModalParamsAction("SMC_CREATE", {
              address: boadContarct.recipient,
            })
          );
        }
      }
      setPending((state) => ({ ...state, publish: false }));
    } else {
      resetForm({});
      setError(null);
      setFormContractData(null);
      setIsValidated(false);
      setIsPublish(false);
    }
  };

  const handleSendMessage = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", null));
  }, [dispatch]);

  const handleUploadFile = async ([file], setFieldValue) => {
    const uploadedTextFile = await parseTextFile(file);
    setFieldValue("source", uploadedTextFile);
    setFileData({
      ...file,
      content: uploadedTextFile,
    });
  };

  const handleUploadEditor = (value, setFieldValue) => {
    setFileData({
      ...fileData,
      name: 'file.txt',
      content: value,

    });
    setFieldValue("source", value);
  };

  const handleReset = (setFieldValue) => {
    setFileData(null);
    setFieldValue("source", "");
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Create New Contract"}/>
      <div className="page-body container-fluid">
        <div className="w-100 h-auto ">
          <Formik
            initialValues={{
              ...INITIAL_FORM_DATA,
              sender: accountRS,
              secret: secretPhrase,
            }}
            onSubmit={handlePublickFormSubmit}
          >
            {({ values, setFieldValue, resetForm }) => {
              return (
                <Form className="form-group-app transparent mb-0">
                  <div className="row ">
                    <div className="col-md-12 col-xl-6 mb-3 h-100 w-100 h-auto p-3">
                      <div className="w-100 card card-light justify-content-start h-100 p-3">
                        <div className="form-group mb-15">
                          <label for="source">Contract source</label>
                          <InputUpload
                            id="drop-zone-create-new-contract"
                            accept={"*"}
                            isDownload={true}
                            isReset={true}
                            file={fileData}
                            handleFileAccepted={(value) =>
                              handleUploadFile(value, setFieldValue)
                            }
                            handleFileReset={() => handleReset(setFieldValue)}
                          />
                        </div>
                        <div className="form-group mb-15 h-100">
                          <label for="source">Contract source</label>
                          <div className="form-group h-100 mb-15 border">
                            <AceEditor
                              setOptions={{ useWorker: false }}
                              onLoad={(editor) => {
                                editor.container.children[0].setAttribute('id', 'ace-editor-create-new-contract')
                              }}
                              mode="javascript"
                              theme="tomorrow"
                              name="source"
                              fontSize={14}
                              tabSize={2}
                              width="100%"
                              height="100%"
                              field={"source"}
                              value={values["source"]}
                              onChange={(value) =>
                                handleUploadEditor(value, setFieldValue)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-6 mb-3 h-100  w-100 h-auto p-3">
                      <div className="w-100 card card-light h-auto p-3 mb-15">
                        <TextualInputComponent
                          id="input-contract-name-create-smart-contract"
                          label="Contract name"
                          name="name"
                          placeholder="Contract class name"
                          type="text"
                        />
                        <TextualInputComponent
                          id="input-arguments-create-smart-contract"
                          label="Arguments"
                          name="params"
                          placeholder="Some comma-separated values"
                          type="text"
                        />
                        <div className={"row"}>
                          <div className={"col-md-4 p-sm-0 pr-md-2"}>
                            <NumericInput
                              id="input-amount-create-smart-contract"
                              label="Amount APL"
                              name="value"
                              type="float"
                              counterLabel={ticker}
                              defaultValue={0}
                            />
                          </div>
                          <div className={"col-md-4 p-sm-0 pr-md-2"}>
                            <NumericInput
                              id="input-fuel-price-create-smart-contract"
                              label="Fuel price"
                              name="fuelPrice"
                              type="float"
                              defaultValue={0}
                            />
                          </div>
                          <div className={"col-md-4 p-sm-0"}>
                            <NumericInput
                              id="input-fuel-limit-create-smart-contract"
                              label="Fuel limit"
                              name="fuelLimit"
                              type="float"
                              defaultValue={0}
                            />
                          </div>
                        </div>
                        <TextualInputComponent
                          id="input-secret-phrase-create-smart-contract"
                          label="Secret phrase"
                          type="password"
                          placeholder="Secret Phrase"
                          name="secret"
                        />
                        <div className="row justify-content-md-between">
                          <div className="col-md-auto mb-2 p-0">
                            <Button
                              id="button-publish-create-smart-contract"
                              name={isPublish ? "Reset form" : "Publish"}
                              className="btn"
                              color="green"
                              size="lg"
                              disabled={!isValidated}
                              isLoading={pending.publish}
                              type="submit"
                            />
                          </div>
                          <div className="col-md-auto mb-2 p-0">
                            <Button
                              id="button-validate-create-smart-contract"
                              name="Validate"
                              className="btn"
                              color="green"
                              size="lg"
                              disabled={isValidated}
                              isLoading={pending.test}
                              onClick={() => handleValidationFormSubmit(values)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card card-light w-100 h-auto py-5 px-3 justify-content-start">
                        <div className="mb-5">
                          <h1 className="title mb-3">
                            <b>Contract Data</b>
                          </h1>
                          {formContarctData
                            ? JSON.stringify(formContarctData)
                            : "Empty"}
                        </div>
                        <div className="mb-5">
                          <h1 className="title mb-3">
                            <b>Error request</b>
                          </h1>
                          {error ? JSON.stringify(error) : "Empty"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
