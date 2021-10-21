import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeEventAction } from '../../../actions/smart-contracts';
import Button from '../../../containers/components/button';
import styles from './ContractItemUnsubscribe.module.scss';

export const ContractItemUnsubscribe = ({ id, contractInstanse }) => {
  const eventsList = useSelector(state => state.smartContract.contractsEvents[id]);
  const dispatch = useDispatch();

  const handleUnsubscribe = (event) => () => {
    contractInstanse.removeEvent(event, (err, data) => {
      if(!err) {
        dispatch(removeEventAction(id, event));
      }
    });
  }

  return (
    <div className={styles.ContractItemUnsubscribe}>
      {eventsList && eventsList.map(event => (
        <div className={styles.ContractItemUnsubscribeItem}>
          <div className={styles.ContractItemUnsubscribeItemDescription}>
            <span>Name - {event.name}</span>
            <span>signature - {event.signature}</span>
            <span>From block - {event.fromBlock}</span>
          </div>
          <Button
            type="button"
            color="green"
            name="Unsubscribe"
            onClick={handleUnsubscribe(event)}
          />
        </div>
      ))}
    </div>
  );
}