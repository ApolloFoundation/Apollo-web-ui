import React from 'react';
import { useSelector } from 'react-redux';
import { CreateContractForm } from './create-contract-form/CreateConctact';
import TabContaier from "../containers/components/tabulator/tab-container";
import TabulationBody from "../containers/components/tabulator/tabuator-body";
import { ContractItem } from './contract-item/ContractItem';

import styles from './events.module.scss';

export const EventsPage = () => {
  const contractsData = useSelector(state => state.smartContract.contractsData);

  return (
    <div className={styles.events}>
      <div className={styles.eventsCreateContract}>
        <h3 className={styles.eventsCreateContractTitle}>
          Add contract
        </h3>
        <CreateContractForm />
      </div>
      <div className='form-group-app'>
          <TabulationBody>
            {Object.entries(contractsData)?.map(([id, contract]) => (
              <TabContaier key={id} sectionName={id} active={1}>
                <ContractItem contractId={id} contractInstanse={contract} />
              </TabContaier>
            ))}
          </TabulationBody>
      </div>
    </div>
  );
}