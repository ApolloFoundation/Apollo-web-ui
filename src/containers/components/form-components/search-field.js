import React from "react";
import TextualInputComponent from "./textual-input1";

const SearchFiledComponent = ({
  setValue,
  name,
  field,
  placeholder,
}) => {
  return (
    <div className="input-group-search-field">
      <TextualInputComponent
        name={name}
        field={field}
        placeholder={placeholder}
        setValue={setValue}
      />
      <button type={"submit"} className="input-icon">
        <i className="zmdi zmdi-search" />
      </button>
    </div>
  );
};
export default SearchFiledComponent
