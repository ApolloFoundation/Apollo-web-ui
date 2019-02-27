import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';

class AccountProperty extends React.Component {
    
    setProperty  = (el) => this.props.setBodyModalParamsAction("SET_ACCOUNT_PROPERTY", el);

    deleteProperty  = (el) => {
        const data = el;
        const {recipientRS, setterRS} = this.props;
        if (this.props.incoming && recipientRS) data.recipientRS = recipientRS;
        else data.setterRS = setterRS;
        this.props.setBodyModalParamsAction("DELETE_ACCOUNT_PROPERTY", data);
    };
    
    render () {
        const {transaction, setterRS, incoming, value, property, setter,recipientRS,setBodyModalParamsAction} = this.props;

    return (
        <tr key={transaction}>
            <td className="blue-link-text">
                <a
                    onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', setter)}
                >
                    {incoming ? setterRS : recipientRS}
                </a>
            </td>
            <td>{property}</td>
            <td>{value}</td>
            <td className="align-right">
                <div className="btn-box inline">
                    {(recipientRS === setterRS || !incoming) &&
                    <a onClick={() => this.setProperty(this.props)}
                        className="btn primary blue">Update</a>
                    }
                    <a onClick={() => this.deleteProperty(this.props)}
                        className="btn primary">Delete</a>
                </div>
            </td>
        </tr>
    )
    }
}
    

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(null, mapDispatchToProps)(AccountProperty)