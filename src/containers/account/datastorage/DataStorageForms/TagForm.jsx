import React, { useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import CustomInput from '../../../components/custom-input/CustomInputWithFormik';
import { useSearchParams } from './useSearchParams';

export const TagForm = () => {
  const history = useHistory();
  const getParams = useSearchParams();

  const handleSubmit = ({ query }) => {
    if (!query) history.push('/data-storage'); 
    else history.push('/data-storage/query=' + query);
  }

  const formik = useFormik({
    initialValues: { query: getParams('query') },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    formik.setFieldValue('query', getParams('query'));
  }, [getParams('query')]);
  
  return (
    <FormikProvider value={formik}>
      <Form className="input-group-app search col-md-3 pl-0">
          <div className="iconned-input-field form-group-app">
              <CustomInput
                placeholder='Name Description Tag'
                type="text"
                name="query"
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
    </FormikProvider>
  );
}
