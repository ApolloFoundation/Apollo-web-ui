import React from 'react';
import { useSelector } from 'react-redux';

const SideBarItem = ({ finishHeight, name }) => {
  const { actualBlock } = useSelector(state => state.account);

  const blocksLeft = parseInt(finishHeight) - parseInt(actualBlock);

  return (
    <div className="chat-box-item">
      <div className="chat-box-rs">
        {name}
      </div>
      <div className="chat-date">
        {blocksLeft > 0 && `Blocks left: ${blocksLeft}`}
        {blocksLeft < 0 && `Poll has been finished ${blocksLeft * -1} blocks ago`}
      </div>
    </div>
  );
};

export default SideBarItem;
