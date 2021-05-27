import React, { useState, useCallback, useEffect } from "react";
import TextualInputComponent from "./textual-input1";

export default function SearchFiledComponent(props) {
  const { setValue, name, field, placeholder } = props;
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
}
