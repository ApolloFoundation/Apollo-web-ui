const fieldValidate = (value, type) => {
  const hexaRegExp = /0x[0-9a-fA-F]+/i;
  const rsRegExp = /APL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}/i;

  let error;
  if (!value) {
    error = "Required";
  } else if (type === "address" && !rsRegExp.test(value) && !hexaRegExp.test(value)) {
    error = "Field not valid";
  }

  return error;
};

export default fieldValidate ;
