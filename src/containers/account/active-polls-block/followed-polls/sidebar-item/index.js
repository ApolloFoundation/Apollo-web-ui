import React from 'react';
import { connect } from 'react-redux';

const SideBarItem = ({ actualBlock, finishHeight, name }) => {
  const blocksLeft = parseInt(finishHeight) - parseInt(actualBlock);

  return (
    <div
      className="chat-box-item"
    >
      <div className="chat-box-rs">
        {name}
      </div>
      <div className="chat-date">
        {
          blocksLeft > 0
          && `Blocks left: ${blocksLeft}`
        }
        {
          blocksLeft < 0
          && `Poll has been finished ${blocksLeft * -1} blocks ago`
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({ actualBlock: state.account.actualBlock });

export default connect(mapStateToProps)(SideBarItem);
