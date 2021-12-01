import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.scss";

const InputDate = ({ label, placeholder, ...args }) => {
  return (
    <div className="date form-group mb-15 text-capitalize">
      {label && <label>{label}</label>}
      <div className="date-wrapper">
        <DatePicker {...args} placeholderText={placeholder} />
        <div className="date-icon">
          <i className="zmdi zmdi-calendar"></i>
        </div>
      </div>
    </div>
  );
};

export default InputDate;
