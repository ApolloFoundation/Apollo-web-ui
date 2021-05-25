/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Formik, Field } from "formik";
import { validationForm } from "./form/form-validation";
import { parseTextFile } from "../../../../helpers/parseFile";
import {
  exportTestContract,
  exportContractSubmit,
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

  const [testData, setTestData] = useState(null);
  const [publishData, setPublishData] = useState(null);
  const [isPublish, setIsPublish] = useState(false);
  const [txCode, setTxCode] = useState(null);
  const [error, setError] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isPending, setIsPending] = useState({
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
      setTestData(data);
      setIsPending({ ...isPending, test: true });
      const result = await dispatch(exportTestContract(data));
      setIsPending({ ...isPending, test: false });
      if (result.errorCode) {
        setError(result);
      } else {
        setTxCode(result.tx);
      }
    }
  };

  const handlePublickFormSubmit = async (resetForm) => {
    if (!isPublish) {
      setIsPending({ ...isPending, publish: true });
      const result = await dispatch(exportContractSubmit({ tx: txCode }));
      setIsPending({ ...isPending, publish: false });
      setPublishData(result);
      if (result.errorCode) {
        setError(result);
        setTxCode(null);
      } else {
        setIsPublish(true);
        dispatch(
          setBodyModalParamsAction("SMC_CREATE", {
            ...testData,
            address: result.recipient,
          })
        );
      }
    } else {
      resetForm({});
      setError(null);
      setTxCode(null);
      setPublishData(null);
      setTestData(null);
    }
  };

  const handleSendMessage = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", {}));
  };

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
      content: value,
    });
    setFieldValue("source", value);
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Create New Contract"}>
        <button
          type={"button"}
          className="btn btn-green btn-sm ml-3"
          onClick={handleSendMessage}
        >
          Send message
        </button>
      </SiteHeader>
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
            {({ values, setFieldValue }) => {
              return (
                <Form className="form-group-app transparent mb-0">
                  <div className="row ">
                    <div className="col-md-12 col-xl-6 mb-3 h-100 w-100 h-auto p-3">
                      <div className="w-100 card card-light justify-content-start h-100 p-3">
                        <div className="form-group mb-15">
                          <label for="source">Contract source</label>
                          <InputUpload
                            id="file"
                            accept={"*"}
                            isDownload={true}
                            file={fileData}
                            handleFileAccepted={(value) =>
                              handleUploadFile(value, setFieldValue)
                            }
                          />
                        </div>
                        <div className="form-group mb-15 h-100">
                          <label for="source">Contract source</label>
                          <div className="form-group h-100 mb-15 border">
                            <AceEditor
                              setOptions={{ useWorker: false }}
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
                          label="Contract name"
                          name="name"
                          placeholder="Contract class name"
                          type="text"
                        />
                        <TextualInputComponent
                          label="Arguments"
                          name="params"
                          placeholder="Some comma-separated values"
                          type="text"
                        />
                        <div className={"row"}>
                          <div className={"col-md-4 p-sm-0 pr-md-2"}>
                            <NumericInput
                              label="Amount APL"
                              name="value"
                              type="float"
                              counterLabel={ticker}
                              defaultValue={0}
                            />
                          </div>
                          <div className={"col-md-4 p-sm-0 pr-md-2"}>
                            <NumericInput
                              label="Fuel price"
                              name="fuelPrice"
                              type="float"
                              defaultValue={0}
                            />
                          </div>
                          <div className={"col-md-4 p-sm-0"}>
                            <NumericInput
                              label="Fuel limit"
                              name="fuelLimit"
                              type="float"
                              defaultValue={0}
                            />
                          </div>
                        </div>
                        <TextualInputComponent
                          label="Secret phrase"
                          type="password"
                          placeholder="Secret Phrase"
                          name="secret"
                        />
                        <div className="row justify-content-md-between">
                          <div className="col-md-auto mb-2 p-0">
                            <Button
                              name={isPublish ? "Reset form" : "Publish"}
                              className="btn"
                              color="green"
                              size="lg"
                              disabled={!txCode}
                              isLoading={isPending.publish}
                              type="submit"
                            />
                          </div>
                          <div className="col-md-auto mb-2 p-0">
                            <Button
                              name="Validate"
                              className="btn"
                              color="green"
                              size="lg"
                              disabled={txCode}
                              isLoading={isPending.test}
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
                          {testData ? JSON.stringify(testData) : "Empty"}
                        </div>
                        <div className="mb-5">
                          <h1 className="title mb-3">
                            <b>Success code</b>
                          </h1>
                          {txCode ? JSON.stringify(txCode) : "Empty"}
                        </div>
                        <div className="mb-5">
                          <h1 className="title mb-3">
                            <b>Send request</b>
                          </h1>
                          {publishData ? JSON.stringify(publishData) : "Empty"}
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
