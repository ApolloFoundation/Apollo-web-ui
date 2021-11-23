import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { getContractExtraInfo } from "../../../../actions/contracts";
import { getLedgerEntryAction } from "../../../../actions/ledger";
import { setLedgerTransactions } from "../../../../modules/dashboard";

export default function SmcInfo({ transaction: info, decimals }) {
  const dispatch = useDispatch();
  const ledgerId = useSelector((state) => state.dashboard.ledgerId);

  const [extraInfo, setExtraInfo] = useState({});
  const [changeFee, setChangeFee] = useState(null);
  const { transaction, amountATM, feeATM, senderRS, recipientRS, fullHash } =
    info;
  const {
    language,
    name,
    params,
    source,
    contractMethod,
    fuelPrice,
    fuelLimit,
  } = extraInfo;

  const getContractInfo = useCallback(
    async (transaction) => {
      const contractInfo = await dispatch(getContractExtraInfo(transaction));
      if (contractInfo) {
        setExtraInfo(JSON.parse(contractInfo.payload));
      }
    },
    [dispatch]
  );

  
  useEffect(() => {
    getContractInfo(transaction);
  }, [transaction, getContractInfo]);

  useEffect(() => {
    if (ledgerId) {
      getLedgerInfo(ledgerId);
      return () => {
        dispatch(setLedgerTransactions(null));
      };
    }
  }, [ledgerId]);

  const getLedgerInfo = useCallback(
    async (ledgerId) => {
      const ledgerInfo = await dispatch(getLedgerEntryAction({ ledgerId }));
      if (ledgerInfo) {
        setChangeFee(ledgerInfo.change);
      }
    },
    [dispatch]
  );

  return (
    <React.Fragment>
      {amountATM && (
        <tr>
          <td>Amount:</td>
          <td>{new Number(amountATM / decimals).toFixed(8)}</td>
        </tr>
      )}
      {feeATM && (
        <tr>
          <td>Fee:</td>
          <td>{(changeFee ? feeATM - changeFee : feeATM) / decimals}</td>
        </tr>
      )}
      {senderRS && (
        <tr>
          <td>From:</td>
          <td>{senderRS}</td>
        </tr>
      )}
      {recipientRS && (
        <tr>
          <td>To:</td>
          <td>{recipientRS}</td>
        </tr>
      )}
      {fullHash && (
        <tr>
          <td>Hash:</td>
          <td>{fullHash}</td>
        </tr>
      )}
      {fuelPrice && (
        <tr>
          <td>FuelPrice:</td>
          <td>{fuelPrice}</td>
        </tr>
      )}
      {fuelLimit && (
        <tr>
          <td>FuelLimit:</td>
          <td>{fuelLimit}</td>
        </tr>
      )}
      {name && (
        <tr>
          <td>Name:</td>
          <td>{name}</td>
        </tr>
      )}
      {contractMethod && (
        <tr>
          <td>Contract Method:</td>
          <td>{contractMethod}</td>
        </tr>
      )}
      {language && (
        <tr>
          <td>Language:</td>
          <td>{language}</td>
        </tr>
      )}
      {params && (
        <tr>
          <td>Params:</td>
          <td>{params}</td>
        </tr>
      )}

      {source && (
        <>
          <tr>
            <td className="align-top">Source:</td>
            <td>
              <AceEditor
                setOptions={{ useWorker: false }}
                mode="javascript"
                theme="tomorrow"
                fontSize={14}
                tabSize={2}
                width="100%"
                height="150px"
                readOnly={true}
                value={source}
              />
            </td>
          </tr>
        </>
      )}
    </React.Fragment>
  );
}
