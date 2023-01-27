import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';
import Button from 'containers/components/button';

export default function AccountProperty(props) {
  const dispatch = useDispatch();

  const {
    transaction, setterRS, incoming, value,
    property, setter, recipientRS,
  } = props;

  const setProperty = useCallback(el => dispatch(setBodyModalParamsAction('SET_ACCOUNT_PROPERTY', el)), [dispatch]);

  const deleteProperty = useCallback(el => {
    const data = el;
    if (incoming && recipientRS) data.recipientRS = recipientRS;
    dispatch(setBodyModalParamsAction('DELETE_ACCOUNT_PROPERTY', data));
  }, [dispatch, incoming, recipientRS]);

  return (
    <tr key={transaction}>
      <td className="blue-link-text">
        <Button
          onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', setter))}
          color="blue-link"
          name={incoming ? setterRS : recipientRS}
        />
      </td>
      <td>{property}</td>
      <td>{value}</td>
      <td className="align-right">
        <div className="btn-box inline">
          {(recipientRS === setterRS || !incoming) && (
            <Button
              onClick={() => setProperty(props)}
              name="Update"
            />
          )}
          <Button
            onClick={() => deleteProperty(props)}
            name="Delete"
          />
        </div>
      </td>
    </tr>
  );
}
