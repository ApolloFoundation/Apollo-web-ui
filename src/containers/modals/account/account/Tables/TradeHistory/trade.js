import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';
import { getDecimalsSelector } from 'selectors';
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

const Trade = ({
  quantityATU, tradeType, timestamp, asset, decimals, priceATM, name,
}) => {
  const dispatch = useDispatch();
  const formatTimestamp = useFormatTimestamp();

  const history = useHistory();

  const accountCoinDecimals = useSelector(getDecimalsSelector);

  const gotToAsset = () => {
    dispatch(setBodyModalParamsAction());
    history.push({ pathname: `/asset-exchange/${asset}` });
  };

  const total = useMemo(() => {
    const num1 = bigIntDecimalsDivision(quantityATU, decimals);
    const num2 = bigIntMultiply(priceATM, 10 ** decimals);
    const num3 = bigIntDivision(num2, accountCoinDecimals);
    return bigIntMultiply(num3, num1);
  }, [quantityATU, decimals, priceATM, accountCoinDecimals]);

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
      <td>{formatTimestamp(timestamp)}</td>
      <td>{tradeType}</td>
      <td className="align-right">{bigIntFormat(bigIntDecimalsDivision(quantityATU, decimals))}</td>
      <td className="align-right">{bigIntFormat(bigIntDivision(bigIntMultiply(priceATM, 10 ** decimals)), accountCoinDecimals)}</td>
      <td className="align-right">{bigIntFormat(total)}</td>
    </tr>
  );
};

export default Trade;
