import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { getContractCode } from "../../../../../actions/contracts";

const PanelCode = ({ contract }) => {
  const dispatch = useDispatch();

  const [contractCode, setContractCode] = useState(null);

  const getSourceSpecification = useCallback(
    async (contract) => {
      const code = await dispatch(getContractCode(contract));
      if (code) {
        setContractCode(code.content);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    getSourceSpecification(contract);
  }, [contract]);

  return (
    <div>
      {contractCode && (
        <AceEditor
          setOptions={{ useWorker: false }}
          mode="javascript"
          theme="tomorrow"
          fontSize={14}
          tabSize={2}
          width="100%"
          height="300px"
          readOnly={true}
          value={contractCode}
        />
      )}
    </div>
  );
};

export default PanelCode;
