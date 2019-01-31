import React from 'react';

const SideBarItem = (el) => {
    const blocksLeft = parseInt(el.finishHeight) - parseInt(this.state.block.height);

    return (
        <div
            className="chat-box-item"
        >
            <div className="chat-box-rs">
                {el.name}
            </div>
            <div className="chat-date">
                {
                    blocksLeft > 0 &&
                    'Blocks left:' + blocksLeft
                }
                {
                    blocksLeft < 0 &&
                    'Poll has been finished ' + (blocksLeft * -1) + ' blocks ago'
                }
            </div>
        </div>
    )
}

export default SideBarItem;