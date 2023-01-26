import React from 'react';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import CustomInput from '../../../../components/custom-input/CustomInputWithFormik';
import styles from './index.module.scss';

export const TagForm = () => {
  const history = useHistory();
  
  const handleSearchByTag = (values) => {
    if (values.tag) {
        history.push(`/marketplace/${values.tag}`);
    }
  };

  return (
    <Formik onSubmit={handleSearchByTag} initialValues={{ tag: '' }}>
      <Form className="iconned-input-field">
        <div className={styles.tagInput}>
          <CustomInput
            name="tag"
            placeholder="Title, description or Tag"
          />
        </div>
        <button className="search-icon">
          <i className="zmdi zmdi-search" />
        </button>
      </Form>
    </Formik>
  );
}