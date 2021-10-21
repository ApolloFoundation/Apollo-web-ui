import React, { useCallback } from 'react';
import { Form, Formik, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Contract } from 'aplsmcjs';
import Button from "../../containers/components/button";
import { addContractAction } from '../../actions/smart-contracts';
import styles from './create-contract.module.scss';

const initialState = {
  contract: '',
};

export const CreateContractForm = () => {
  const dispatch = useDispatch();
  const contractData = useSelector(state => state.smartContract.contractData);

  const handleSubmit = useCallback(({ contract }) => {
    const smartContract = new Contract({
      apiPath: `/rest/v2/smc/${contract}/event`,
      socketPath: 'ws://51.15.250.32:7876/smc/event/'
    }, contract, {
      onContractConnectionClose: () => {
        if(contractData[contract]) {
          smartContract.createConnection();
        }
      }
    });
    dispatch(addContractAction(contract, smartContract));
  }, [dispatch]);

  return (
    <Formik
      initialValues={initialState}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit }) => (
        <Form className={styles.createContractForm} onSubmit={handleSubmit}>
          <Field className={styles.createContractInput} type="text" name="contract" placeholder="Enter contract id" />
          <Button
            type="submit"
            color="green"
            name="Add contract"
            size="lg"
          />
        </Form>
      )}
    </Formik>
  );
}