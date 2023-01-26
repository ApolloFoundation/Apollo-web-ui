import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatTimestamp } from '../../../../../../helpers/util/time';
import { setBodyModalParamsAction } from '../../../../../../modules/modals';

const Trade = ({
  quantityATU, tradeType, timestamp, asset, decimals, priceATM, name,
}) => {
  const dispatch = useDispatch();

  const history = useHistory();

  const { decimals: accountCoinDecimals } = useSelector(state => state.account);

  const gotToAsset = () => {
    dispatch(setBodyModalParamsAction());
    history.push({ pathname: `/asset-exchange/${asset}` });
  };

  return (
    <tr>
      <td className="blue-link-text">
        <span
          className="cursor-pointer blue-link-text"
          onClick={gotToAsset}
        >
          {name}
        </span>
      </td>
      <td>{dispatch(formatTimestamp(timestamp))}</td>
      <td>{tradeType}</td>
      <td className="align-right">{quantityATU / (10 ** decimals)}</td>
      <td className="align-right">{(priceATM * (10 ** decimals)) / accountCoinDecimals}</td>
      <td className="align-right">{(quantityATU / (10 ** decimals)) * ((priceATM * (10 ** decimals)) / accountCoinDecimals)}</td>
    </tr>
  );
};

export default Trade;
