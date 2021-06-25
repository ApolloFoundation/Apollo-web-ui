import React from "react";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import Button from "../../../components/button";
import { Form, Formik, Field } from "formik";
import fieldValidate from "./form-validation";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { useDispatch } from "react-redux";

const ExplorerForm = ({ fields, address, methodName: name }) => {
  const dispatch = useDispatch();

  const getInitialValues = (fields) => {
    const initialValues = {};
    fields.forEach((field) => (initialValues[field.name] = ""));
    return initialValues;
  };

  const onSubmit = (values) => {
    const params = Object.keys(values)
      .map((key) => values[key])
      .join(",");

    dispatch(
      setBodyModalParamsAction("SMC_CREATE", {
        address,
        name,
        params,
      })
    );
  };
  return (
    <Formik initialValues={getInitialValues(fields)} onSubmit={onSubmit}>
      {({ errors, touched }) => {
        return (
          <Form>
            {fields.map((item) => (
              <Field
                name={item.name}
                validate={(value) => fieldValidate(value, item.type)}
                render={({ field: { name } }) => (
                  <div className="mb-3">
                    <TextualInputComponent
                      label={name}
                      name={name}
                      placeholder={name}
                      type={item.type === "uint" ? "float" : "text"}
                    />
                    {errors[name] && touched[name] ? (
                      <div className={"text-danger"}>{errors[item.name]}</div>
                    ) : null}
                  </div>
                )}
              />
            ))}

            <Button
              name="Submit"
              className="w-25"
              color="green"
              type="submit"
            />
          </Form>
        );
      }}
    </Formik>
  );
};
export default ExplorerForm;
