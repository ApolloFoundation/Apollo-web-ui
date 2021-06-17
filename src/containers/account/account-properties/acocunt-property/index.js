import React from "react";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";
import Button from "../../../components/button";

class AccountProperty extends React.Component {
  setProperty = (el) =>
    this.props.setBodyModalParamsAction("SET_ACCOUNT_PROPERTY", el);

  deleteProperty = (el) => {
    const data = el;
    const { recipientRS, incoming } = this.props;
    if (incoming && recipientRS) data.recipientRS = recipientRS;
    this.props.setBodyModalParamsAction("DELETE_ACCOUNT_PROPERTY", data);
  };

  render() {
    const {
      transaction,
      setterRS,
      incoming,
      value,
      property,
      setter,
      recipientRS,
      setBodyModalParamsAction,
    } = this.props;

    return (
      <tr key={transaction}>
        <td>
          <Button
            color="blue-link"
            onClick={() => setBodyModalParamsAction("INFO_ACCOUNT", setter)}
            name={incoming ? setterRS : recipientRS}
          />
        </td>
        <td>{property}</td>
        <td>{value}</td>
        <td className="align-right">
          <div className="btn-box inline">
            {(recipientRS === setterRS || !incoming) && (
              <Button
                onClick={() => this.setProperty(this.props)}
                name={"Update"}
              />
            )}
            <Button
              onClick={() => this.deleteProperty(this.props)}
              name={"Delete"}
            />
          </div>
        </td>
      </tr>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(null, mapDispatchToProps)(AccountProperty);
