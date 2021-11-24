import React, { useCallback } from "react";
import { useDispatch, useStore } from "react-redux";
import { Contract } from "aplsmcjs";
import { Form, Formik } from "formik";
import { addContractAction } from "../../../actions/smart-contracts";
import { getSmcSpecification } from "../../../actions/contracts";
import Button from "../../components/button";
import TextualInputComponent from "../../components/form-components/textual-input1";
import { validationForm } from "../../../helpers/forms/contractValidator";

const initialState = {
  contract: "",
};

const EventAddContract = ({ closeModal }) => {
  const dispatch = useDispatch();
  const store = useStore();

  const handleSubmit = useCallback(
    async ({ contract }) => {
      const isValidForm = validationForm({contract: contract});
      if (!isValidForm) {
        const specification = await dispatch(getSmcSpecification(contract));
        if (specification) {
          try {
            let { host, protocol } = window.location;
            const isDev = process.env.NODE_ENV === "development";
            const protocolPrefix =
              protocol === "https:" || !isDev ? "wss:" : "ws:";
            const forProxy = isDev ? "socket/" : "";
            const smartContract = new Contract(
              {
                apiPath: `/rest/v2/smc/${contract}/event`,
                socketPath: `${protocolPrefix}//${host}/${forProxy}smc/event/`,
              }, contract, {
                onContractConnectionClose: () => {
                  const contractData =
                    store.getState().smartContract.contractsData;
                  if (contractData && contractData[contract]) {
                    smartContract.createConnection();
                    console.log("do reconnect", contract);
                  } else {
                    console.log("connection close for", contract);
                  }
                },
              }
            );
            dispatch(addContractAction(contract, smartContract));
            closeModal();
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
    [dispatch, store]
  );

  return (
    <div className="modal-box">
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initialState}
      >
        <Form>
          <div className="modal-form">
            <div className="form-group-app">
              <button
                type="button"
                id="button-close-modal-event-add-contract"
                onClick={closeModal}
                className="exit"
              >
                <i className="zmdi zmdi-close" />
              </button>
              <div className="form-title">Add contract</div>
              <div className="mb-3">
                <TextualInputComponent
                  className={"text-capitalize"}
                  label="Contract id"
                  name="contract"
                  placeholder="contract id"
                  type="text"
                />
              </div>
              <Button
                id="event-add-contract"
                type="submit"
                size="lg"
                color="green"
                name="Add contract"
              />
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EventAddContract;
