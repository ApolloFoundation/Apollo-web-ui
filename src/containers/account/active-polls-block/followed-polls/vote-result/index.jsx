import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../../modules/modals';

const VoteResult = ({ votes, voter, voterRS }) => {
  const dispatch = useDispatch();
  return (
    <tr key={uuidv4()}>
      <td>
        <span className="blue-link-text" onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', voter))}>
          {' '}
          {voterRS}
          {' '}
        </span>
      </td>
      {votes?.map((subEl, subIndex) => {
        if (subEl.length) {
          return (
            <td key={uuidv4()} className="align-right">{subEl}</td>
          );
        }
        return (
          <td key={uuidv4()} className="align-right">-</td>
        );
      })}
    </tr>
  );
};

export default VoteResult;
