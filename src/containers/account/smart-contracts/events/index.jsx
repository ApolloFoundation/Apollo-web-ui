import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { removeContractAction } from "../../../../actions/smart-contracts";
import SiteHeader from "../../../components/site-header";
import TabContaier from "../../../components/tabulator/tab-container";
import TabulationBody from "../../../components/tabulator/tabuator-body";
import Button from "../../../components/button";
import ContractItem from "./contract-item";
import InfoBox from "../../../components/info-box";

const Events = () => {
  const dispatch = useDispatch();

  const contractsData = useSelector((state) => state.smartContract.contractsData);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (Object.keys(contractsData).length == 0) {
      handleAddContractModal();
    }
  }, []);

  useEffect(() => {
    setActive(Object.entries(contractsData).length - 1);
  }, [contractsData]);

  const handleAddContractModal = useCallback(() => {
    dispatch(setBodyModalParamsAction("EVENT_ADD_CONRACT", null));
  }, [dispatch]);

  const handleClose = (index) => {
    const [id, contract] = Object.entries(contractsData)[index];
    dispatch(removeContractAction(id));
    contract.closeEventConnection();
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Events"}>
        <Button
          name="Add contract"
          color="green"
          size="sm"
          onClick={handleAddContractModal}
        />
      </SiteHeader>
      <div className="page-body container-fluid">
        {Object.keys(contractsData).length == 0 ? (
          <InfoBox default>{"Empty list"}</InfoBox>
        ) : (
          <div className="form-group-app transparent">
            <TabulationBody
              className="transparent"
              active={active}
              handleClose={handleClose}
            >
              {Object.entries(contractsData)?.map(([id, contract]) => (
                <TabContaier key={id} sectionName={id} activeTab={active}>
                  <ContractItem contractId={id} contractInstanse={contract} />
                </TabContaier>
              ))}
            </TabulationBody>
          </div>
        )}
      </div>
    </div>
  );
};
export default Events;
