import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { getContractExtraInfo } from "../../../../actions/contracts";

export default function SmcInfo({ transaction: info, decimals }) {
	const dispatch = useDispatch();
	const [extraInfo, setExtraInfo] = useState({});
	const { transaction, amountATM, feeATM, senderRS, recipientRS, fullHash } = info;
	const { language, name, params, source, contractMethod } = extraInfo;

	useEffect(() => {
		getContractInfo(transaction);
	}, []);

	const getContractInfo = useCallback(async (transaction) => {
		const contractInfo = await dispatch(getContractExtraInfo(transaction));
		if (contractInfo) {
			setExtraInfo(JSON.parse(contractInfo.payload));
		}
	}, [dispatch]);

	return (
		<React.Fragment>
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
			{amountATM && (
				<tr>
					<td>Amount:</td>
					<td>{new Number(amountATM / decimals).toFixed(8)}</td>
				</tr>
			)}
			{feeATM && (
				<tr>
					<td>Fee:</td>
					<td>{feeATM / decimals}</td>
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
