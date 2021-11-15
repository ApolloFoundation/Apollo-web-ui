import React from "react";
import { useSelector } from "react-redux";
import CustomTable from "../../../../components/tables/table1";
import ContractItemUn from "../../table-items/contract-item-unsubscribe";
import ContractItemData from "../../table-items/contract-item-data";
import ContractItemForm from "./contract-item-form";

const ContractItem = ({ contractId, contractInstanse }) => {
  const contractEventsData = useSelector(
    (state) => state.smartContract.contractsEventsData[contractId]
  );
  const eventsList = useSelector(
    (state) => state.smartContract.contractsEvents[contractId]
  );

  return (
    <div className="row">
      <div className="col-12 col-md-6 p-3">
        <div className="w-100 card card-light h-auto p-3">
          <ContractItemForm
            contractId={contractId}
            contractInstanse={contractInstanse}
          />
        </div>
      </div>
      <div className="col-12 col-md-6 p-3">
        <div className="card full-height">
          <div class="card-title">Events subscription</div>
          <div class="card-body">
            <CustomTable
              id={"smart-contracts"}
              header={[
                {
                  name: "Name",
                  alignRight: false,
                },
                {
                  name: "Description",
                  alignRight: false,
                },
                {
                  name: "From Block",
                  alignRight: false,
                },
                {
                  name: "Unsubscribe",
                  alignRight: true,
                },
              ]}
              className="no-min-height"
              emptyMessage="Events list is empty."
              passProps={{
                contractId: contractId,
                contractInstanse: contractInstanse,
              }}
              TableRowComponent={ContractItemUn}
              tableData={eventsList || []}
            />
          </div>
        </div>
      </div>
      <div className="col-12 p-3">
        <div className="card full-height">
          <div class="card-title">Events data</div>
          <div class="card-body">
            <CustomTable
              id={"smart-contracts"}
              header={[
                {
                  name: "Event",
                  alignRight: false,
                },
                {
                  name: "Data",
                  alignRight: false,
                },
                {
                  name: "Signature",
                  alignRight: false,
                },
                {
                  name: "Transaction",
                  alignRight: false,
                },
                {
                  name: "Block number",
                  alignRight: false,
                },
                {
                  name: "Address",
                  alignRight: false,
                },
              ]}
              className="no-min-height"
              emptyMessage="Events list is empty."
              TableRowComponent={ContractItemData}
              tableData={contractEventsData || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractItem;