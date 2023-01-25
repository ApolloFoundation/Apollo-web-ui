import React from 'react';
import { connect } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';

const VoteResult = ({
  votes, voter, voterRS, setBodyModalParamsAction,
}) => (
  <tr>
    <td className="blue-link-text">
      <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', voter)}>
        {' '}
        {voterRS}
        {' '}
      </a>
    </td>
    {votes && votes.map((subEl) => {
      if (subEl.length) {
        return (
          <td className="align-right">{subEl}</td>
        );
      }
      return (
        <td className="align-right">-</td>
      );
    })}
  </tr>
);

const mapDispatchToProps = dispatch => ({ setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)) });

export default connect(null, mapDispatchToProps)(VoteResult);
