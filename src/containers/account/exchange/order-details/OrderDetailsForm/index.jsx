import React from 'react';
import { Formik, Form } from "formik";
import TextualInputComponent from "../../../../components/form-components/TextualInput";
import SimpleProgressBar from '../../../../components/simple-progress-bar/simple-progress-bar';
import ContractStatusItem from '../contract-status-item';

export const OrderDetailsForm = ({
  selectedContractStatus,
  allContractStatus,
  account,
  orderInfo,
  isShowSelectedContractStatus,
  isShowingContractHistory,
  currentContractOrder,
}) => (
  <Formik initialValues={{
    current: `${account.ticker}/${orderInfo.type.toUpperCase()}`,
    typeName: orderInfo.typeName,
    pairRate: orderInfo.pairRate,
    offerAmount: orderInfo.offerAmount,
    total: orderInfo.total,
    status: orderInfo.statusName,
  }}>
    <Form className="modal-form">
      <div className="form-group-app">
        {!isShowingContractHistory
          ? (
            <>
              {isShowSelectedContractStatus && (
                <SimpleProgressBar
                  contractOrder={currentContractOrder}
                  blockTime={account.timestamp}
                  status={orderInfo.statusName}
                />
              )}
              <TextualInputComponent
                name="current"
                label="Pair Name"
                defaultValue={`${account.ticker}/${orderInfo.type.toUpperCase()}`}
                disabled
                placeholder="Pair Name"
              />
              <TextualInputComponent
                name="typeName"
                label="Type"
                defaultValue={orderInfo.typeName}
                disabled
                placeholder="Type"
              />
              <TextualInputComponent
                name="pairRate"
                label="Price"
                defaultValue={orderInfo.pairRate}
                disabled
                placeholder="Price"
              />
              <TextualInputComponent
                name="offerAmount"
                label="Amount"
                defaultValue={orderInfo.offerAmount}
                disabled
                placeholder="Amount"
              />
              <TextualInputComponent
                name="total"
                label="Total"
                disabled
                defaultValue={orderInfo.total}
                placeholder="Total"
              />
              <TextualInputComponent
                name="status"
                label="Status"
                defaultValue={orderInfo.statusName}
                disabled
                placeholder="Status"
              />
              {isShowSelectedContractStatus && ( 
                <ContractStatusItem
                  account={account}
                  contracts={selectedContractStatus}
                  label="Contract (Status) details"
                />
              )}
            </>
          ) : (!!allContractStatus?.length && <ContractStatusItem isContractHistory account={account} contracts={allContractStatus} />)}
        </div>
    </Form>
  </Formik>
);