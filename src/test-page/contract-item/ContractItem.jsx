import React, { useCallback } from 'react';
import { Form, Formik, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames';
import Button from "../../containers/components/button";
import {
  addContractEventDataAction,
  addContractEventInfoAction,
  addEventAction,
  removeContractAction
} from '../../actions/smart-contracts';
import { ContractItemUnsubscribe } from './contract-item-unsubscribe/ContractItemUnsubscribe';
import styles from './ContractItem.module.scss';

const initialState = {
  eventName: '',
  filter: '',
  fromBlock: 0,
  signature: '',
}

export const ContractItem = ({ contractId, contractInstanse }) => {
  const dispatch = useDispatch();
  const contractEventsData = useSelector(state => state.smartContract.contractsEventsData[contractId]);

  const handleEventMessage = (err, data) => {
    dispatch(addContractEventDataAction(contractId, err || data));
  }

  const handleEventSubscription = (err, data) => {
    dispatch(addContractEventInfoAction(contractId, err || data));
  }

  const prepareData = ({ eventName, filter, signature, fromBlock }) => {
    const data = {
      name: eventName,
      signature,
      fromBlock,
    }

    if(filter.trim().length > 0) {
      data.filter = JSON.parse(filter);
    }
    console.log("🚀 ~ file: ContractItem.jsx ~ line 43 ~ prepareData ~ data", data, filter.trim())

    return data;
  } 

  const handleAddEvent = (values) => () => {
    const data = prepareData(values);

    const event = contractInstanse.addEvent(data, handleEventMessage, handleEventSubscription);
    dispatch(addEventAction(contractId, event));
  }

  const handleAddEventOnce = (values) => () => {
    const data = prepareData(values);

    const event = contractInstanse.addEventOnce(data, handleEventMessage, handleEventSubscription);
    dispatch(addEventAction(contractId, event));
  }

  const handleTestEvent = () => {
    contractInstanse.createTest(handleEventMessage, handleEventSubscription);
  }

  const handleClose = useCallback(() => {
    dispatch(removeContractAction(contractId));
    contractInstanse.closeEventConnection();
  }, [dispatch, contractId])

  return (
    <div className={styles.contractItem}>
      <div className={styles.contractItemWrapper}>
        <Formik
          initialValues={initialState}
          onSubmit={() => {}}
        >
          {({ values }) => (
            <Form className={classNames(styles.contractItemForm, styles.contractItemBlock)}>
              <h3 className={styles.contractItemTitle}>Add contract event</h3>
              <Field className={styles.contractItemInput} type="text" name="eventName" placeholder="Enter event name" />
              <Field className={styles.contractItemInput} type="text" name="signature" placeholder="Enter event signature" />
              <Field className={styles.contractItemInput} type="text" name="fromBlock" placeholder="From block" />
              <Field className={styles.contractItemFilter} res rows="5" as="textarea" name="filter" placeholder="Enter filter conditions" />

              <div className={styles.contractItemButtons}>
                <Button type="button" color="green" name="Add event" onClick={handleAddEvent(values)} />
                <Button type="button" color="green" name="Add event once" onClick={handleAddEventOnce(values)}/>
                <Button type="button" color="green" name="Add test event" onClick={handleTestEvent}/>
              </div>
            </Form>
          )}
        </Formik>  
        <div className={classNames(styles.contractItemBlock, styles.contractItemEvents)}>
          {!contractEventsData && (
            <div>
              Events list is empty
            </div>
          )}
          {contractEventsData && contractEventsData.map(item => (
            <div className={styles.contractItemEventInfo} key={item.subscribtionId}>
              <span>Event - {item.event}</span>
              <span>Data - {item.data}</span>
              <span>Signature - {item.signature}</span>
              <span>transaction hash - {item.transactionHash}</span>
              <span>Block hash - {item.blockHash}</span>
              <span>Block number - {item.blockNumber}</span>
              <span>Address - {item.address}</span>
            </div>
          ))}
        </div>
      </div>
      <ContractItemUnsubscribe id={contractId} contractInstanse={contractInstanse} />
      
      <div className={styles.contractItemClose}>
        <Button
          size="lg"
          type="button"
          onClick={handleClose}
          color="green"
          name="Close Tab"
        />
      </div>
    </div>
  );
}