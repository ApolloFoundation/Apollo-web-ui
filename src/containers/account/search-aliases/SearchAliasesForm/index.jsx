import React from 'react';
import { Formik, Form } from "formik";
import CustomInput from "../../../components/custom-input/index";

export const SearchAliasForm = ({ onSubmit }) => (
  <Formik
    onSubmit={onSubmit}
    initialValues={{ alias: '' }}
  >
    <Form className="input-group-app search col-md-3 pl-0">
        <div className="iconned-input-field form-group-app">
            <CustomInput
                placeholder='Alias'
                type="text"
                name="alias"
                classNameWrapper="mb-0"
            />
            <button
                type='submit'
                className="input-icon"
                style={{
                    width: 41,
                    height: 40,
                }}
            >
                <i className="zmdi zmdi-search"/>
            </button>
        </div>
    </Form>
  </Formik>
);