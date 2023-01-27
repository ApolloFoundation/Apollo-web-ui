import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from 'modules/modals';

const AssetItem = ({
  asset,
  accountRS,
  account,
  name,
  numberOfAccounts,
  decimals,
  initialQuantityATU,
  quantityATU,
  numberOfTransfers,
  numberOfTrades,
}) => {
  const dispatch = useDispatch();

  const initialSupply = initialQuantityATU / (10 ** decimals);
  const totalSupply = quantityATU / (10 ** decimals);

  return (
    (
      <tr>
        <td className="blue-link-text">
          <Link to={`/asset-exchange/${asset}`}>
            {name}
          </Link>
        </td>
        <td>
          <span className="blue-link-text" onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account))}>
            {accountRS}
          </span>
        </td>
        <td className="align-right">{numberOfAccounts}</td>
        <td className="align-right">{numberOfTransfers}</td>
        <td className="align-right">{numberOfTrades}</td>
        <td className="align-right">{initialSupply}</td>
        <td className="align-right">{totalSupply}</td>
      </tr>
    )
  );
};

export default AssetItem;
