import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';

const VoteResult = ({
  votes, voter, voterRS, setBodyModalParamsAction,
}) => (
  <tr key={uuidv4()}>
    <td className="blue-link-text">
      <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', voter)}>
        {' '}
        {voterRS}
        {' '}
      </a>
    </td>
    {votes && votes.map((subEl, subIndex) => {
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

const mapDispatchToProps = dispatch => ({ setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)) });

export default connect(null, mapDispatchToProps)(VoteResult);
