import React from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const VoteResult = ({votes, voter, voterRS, setBodyModalParamsAction}) => (
    <tr key={uuid()}>
        <td className="blue-link-text">
            <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', voter)}> {voterRS} </a>
        </td>
        {
            votes && 
            votes.map((subEl, subIndex) => {
                if (subEl.length) {
                    return (
                        <td key={uuid()} className="align-right">{subEl}</td>
                    );
                } else {
                    return (
                        <td key={uuid()} className="align-right">-</td>
                    );
                }
            })
        }
    </tr>
)

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),    
})

export default connect(null, mapDispatchToProps)(VoteResult)