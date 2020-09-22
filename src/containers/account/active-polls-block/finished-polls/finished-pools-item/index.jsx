/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { formatTimestamp } from '../../../../../helpers/util/time';
import Button from '../../../../components/button';

const FinishedpollsItem = ({
  name, poll, description, accountRS, account, timestamp,
}) => {
  const dispatch = useDispatch();

  return (
    <tr key={uuidv4()}>
      <td key={uuidv4()}>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', poll))}
        >
          {name}
        </span>
      </td>
      <td key={uuidv4()} className="">
        {' '}
        {(description.length > 100) ? `${description.slice(0, 100)}...` : description}
        {' '}
      </td>
      <td key={uuidv4()}>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account))}
        >
          {' '}
          {accountRS}
          {' '}
        </span>
      </td>
      <td key={uuidv4()} className="">
        {dispatch(formatTimestamp(timestamp))}
      </td>
      <td key={uuidv4()} className="align-right">
        <div className="btn-box inline">
          <Button
            onClick={() => dispatch(setBodyModalParamsAction('POLL_RESULTS', poll))}
            name="Results"
          />
          <Link to={`/followed-polls/${poll}`} className="btn btn-default">View</Link>
        </div>
      </td>
    </tr>
  );
};

export default FinishedpollsItem;
