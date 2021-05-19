/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SiteHeader from "../../../components/site-header";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { Form, Formik } from "formik";
import Button from "../../../components/button";
import { validationForm } from "./form/form-validation";
import {
  exportTestContract,
  exportContractSubmit,
} from "../../../../../src/actions/contracts";
import CreateSmartContractForm from "./form";

const INITIAL_FORM_DATA = {
  source: "",
  name: "",
  params: "",
  value: 0,
  fuelPrice: 0,
  fuelLimit: 0,
};
export default function SmartContracts() {
  const dispatch = useDispatch();
  const {
    accountRS,
    passPhrase: secretPhrase,
    ticker,
  } = useSelector((state) => state.account);
  const [isPending, setIsPending] = useState({
    test: false,
    publish: false,
  });
  const [txCode, setTxCode] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [publickData, setPublickData] = useState(null);
  const [isPublish, setIsPublish] = useState(false);
  const [error, setError] = useState(null);

  const handleValidationFormSubmit = async (values) => {
    const isValidForm = validationForm(values);

    if (!isValidForm) {
      const data = {
        ...values,
        value: Number(values.value) * Math.pow(10, 8),
        params: values.params.split(","),
      };
      setContractData(data);
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

  const handlePublickFormSubmit = async () => {
    setIsPending({ ...isPending, publish: true });
    const result = await dispatch(exportContractSubmit({ tx: txCode }));
    setIsPending({ ...isPending, publish: false });
    setPublickData(result);
    if (result.errorCode) {
      setError(result);
      setTxCode(null);
    } else {
      setIsPublish(true);
      dispatch(
        setBodyModalParamsAction("SMC_CREATE", {
          ...contractData,
          address: result.recipient,
        })
      );
    }
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Create New Contract"}>
        <button
          type={"button"}
          className="btn btn-green btn-sm"
          style={{ marginLeft: 15 }}
          onClick={() => dispatch(setBodyModalParamsAction("SMC_CREATE", {}))}
        >
          Send message
        </button>
      </SiteHeader>
      <div className="page-body container-fluid">
        <div className="row ">
          <div className="col-md-12 col-xl-6 mb-3 h-100 ">
            <div className="card card-light w-100 h-auto p-3">
              <Formik
                initialValues={{
                  ...INITIAL_FORM_DATA,
                  sender: accountRS,
                  secret: secretPhrase,
                }}
                onSubmit={handleValidationFormSubmit}
              >
                {({ resetForm }) => (
                  <Form className="form-group-app d-flex flex-column  mb-0">
                    <CreateSmartContractForm ticker={ticker} />
                    <div className="row justify-content-md-between">
                      <div className="col-md-auto mb-2 p-0">
                        <Button
                          name={isPublish ? "Reset form" : "Publish"}
                          className="btn"
                          color="green"
                          size="lg"
                          disabled={!txCode}
                          isLoading={isPending.publish}
                          onClick={
                            isPublish ? resetForm : handlePublickFormSubmit
                          }
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
                          type="submit"
                        />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div className="col-md-12 col-xl-6 mb-3 h-auto">
            <div className="card card-light w-100 h-100 py-5 px-3 justify-content-start">
              <div className="mb-5">
                <h1 className="title mb-3">
                  <b>Contract Data</b>
                </h1>
                {contractData ? JSON.stringify(contractData) : "Empty"}
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
                {publickData ? JSON.stringify(publickData) : "Empty"}
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
      </div>
    </div>
  );
}
