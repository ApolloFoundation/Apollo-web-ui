import React, { forwardRef  } from 'react';
import { Field, FormikProvider, useFormik } from 'formik';
import IconndeButton from '../../iconned-button';

export const InputSearchForm = forwardRef((props, ref) => {
  const formik = useFormik({
    initialValues: {
      value: '',
    },
    onSubmit: props.onSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <div ref={ref} className='searching-window-wrap'>
          <div className='searching-window-slide'> 
              <div className='searching-window-icon'>
                <IconndeButton
                    id='open-search-transaction'
                    icon={<i className="zmdi zmdi-search"/>}
                    action={formik.handleSubmit}
                />
              </div>
              <Field
                name='value'
                className="searching-window"
                type="text"
                placeholder="Enter Transaction/Account ID/Block ID"
              />
          </div>
      </div>
    </FormikProvider>
  );
})