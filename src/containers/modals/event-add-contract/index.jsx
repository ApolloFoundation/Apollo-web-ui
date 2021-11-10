import React, { useCallback } from "react";
import { useDispatch, useStore } from "react-redux";
import { Contract } from "aplsmcjs";
import { Form, Formik, Field } from "formik";
import { addContractAction } from "../../../actions/smart-contracts";
import Button from "../../components/button";
import TextualInputComponent from "../../components/form-components/textual-input1";
import config from '../../../config';

const initialState = {
  contract: "",
};

const EventAddContract = ({ closeModal }) => {
  const dispatch = useDispatch();
  const store = useStore();

  const fieldValidate = (value) => {
    const rsRegExp = /APL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}/i;
    let error;
    if (!value) {
      error = "Required";
    } else if (!rsRegExp.test(value)) {
      error = "Field not valid";
    }
    return error;
  };
  const handleSubmit = useCallback(
    ({ contract }) => {
      const isValidForm = fieldValidate(contract);
      if (!isValidForm) {
        try {
          let { host, protocol } = window.location;
          const protocolPrefix = protocol === 'https:' ? 'wss:' : 'ws:';
          const smartContract = new Contract(
            {
              apiPath: `/rest/v2/smc/${contract}/event`,
              socketPath: `${protocolPrefix}//${host}/socket/smc/event/`,
            },
            contract,
            {
              onContractConnectionClose: () => {
                const contractData = store.getState().smartContract.contractsData;
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
        {({ errors, touched }) => {
          return (
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
                  <div className="form-title">
                    <p>Add contract</p>
                  </div>
                  <Field
                    name="contract"
                    validate={fieldValidate}
                    render={() => (
                      <div className="mb-3">
                        <TextualInputComponent
                          className={"text-capitalize"}
                          label="Contract id"
                          name="contract"
                          placeholder="contract id"
                          type="text"
                        />
                        {errors["contract"] && touched["contract"] && (
                          <div className={"text-danger"}>
                            {errors["contract"]}
                          </div>
                        )}
                      </div>
                    )}
                  />
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
          );
        }}
      </Formik>
    </div>
  );
};

export default EventAddContract;
