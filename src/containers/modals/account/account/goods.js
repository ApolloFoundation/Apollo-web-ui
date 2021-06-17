import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import Button from '../../../components/button';

const Goods = ({
  name, goods, quantity, priceATM,
}) => {
  const dispatch = useDispatch();

  const { decimals, ticker } = useSelector(state => state.account);

  return (
    <tr className="marketplace-tab-item">
      <td>
          <Button
              color="blue-link"
              onClick={() => dispatch(setBodyModalParamsAction('MARKETPLACE_PURCHASE', goods))}
              name={name}
            />
      </td>
      <td>
        {priceATM / decimals}
        {' '}
        {ticker}
      </td>
      <td>{quantity}</td>
    </tr>
  );
};

export default Goods;
