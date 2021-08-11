/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState } from "react";
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
      setIsPending({ ...isPending, test: true });
      const testContract = await dispatch(exportTestContract(data));
      setIsPending({ ...isPending, test: false });
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
      setIsPending({ ...isPending, publish: true });
      const publishContract = await dispatch(
        exportContractSubmit(formContarctData)
      );
      if (publishContract.errorCode) {
        setError(publishContract);
        setIsPending({ ...isPending, publish: false });
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
      setIsPending({ ...isPending, publish: false });
    } else {
      resetForm({});
      setError(null);
      setFormContractData(null);
      setIsValidated(false)
      setIsPublish(false)
    }
  };

  const handleSendMessage = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", null));
  };

  const handleCrateToken = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN", null));
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

  const handleReset = (setFieldValue) => {
    setFileData(null);
    setFieldValue("source", "");
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
        <button
          type={"button"}
          className="btn btn-green btn-sm ml-3"
          onClick={handleCrateToken}
        >
          Create token
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
            {({ values, setFieldValue, resetForm }) => {
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
                              disabled={!isValidated}
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
                              disabled={isValidated}
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
