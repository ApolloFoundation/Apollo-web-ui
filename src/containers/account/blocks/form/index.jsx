
import React from 'react';
import { Field, Formik, Form } from 'formik';
import classNames from 'classnames';
import styles from './index.module.scss';

export const BlocksForm = ({ onSubmit }) => (
    <Formik onSubmit={onSubmit} initialValues={{ height: '' }}>
        <Form className="input-group-app search col-md-3 pl-0">
            <div className="iconned-input-field block">
                <Field
                    placeholder='Block height'
                    name='height'
                    type="text"
                />
                <button
                    type='submit'
                    className={classNames("input-icon", styles.iconButton)}
                    style={{width: 41}}
                >
                    <i className="zmdi zmdi-search"/>
                </button>
            </div>
        </Form>
    </Formik>
);