import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDecimalsSelector, getTickerSelector } from 'selectors';
import { setBodyModalParamsAction } from 'modules/modals';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const Goods = ({
  name, goods, quantity, priceATM,
}) => {
  const dispatch = useDispatch();
  const decimals = useSelector(getDecimalsSelector);
  const ticker = useSelector(getTickerSelector);

  const handleModal = () => {
    dispatch(setBodyModalParamsAction('MARKETPLACE_PURCHASE', goods));
  }

  return (
    <tr className="marketplace-tab-item">
      <td className="blue-link-text">
        <a onClick={handleModal}>
          {name}
        </a>
      </td>
      <td>
        {`${bigIntFormat(bigIntDivision(priceATM, decimals))} ${ticker}`}
      </td>
      <td>{quantity}</td>
    </tr>
  );
};

export default Goods;
