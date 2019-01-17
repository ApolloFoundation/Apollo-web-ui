import React from 'react';
import {Form, Text} from 'react-form';

const SingleSearchForm = ({defaultValue, field, type, placeholder, handleSearchBy}) => (
    <div className="row">
        <div className="col-md-4">
            <div className="transactions-filters align-for-inputs">
                <div className="search-bar">
                    <Form
                        onSubmit={values => handleSearchBy(values)}
                        render={({submitForm, setAllValues, setValue}) => {
                            return (
                                <form onSubmit={submitForm} className="input-group-app search">
                                    <div className="iconned-input-field">
                                        <Text
                                            placeholder={placeholder}
                                            defaultValue={defaultValue}
                                            field={field}
                                            type={type}
                                        />
                                        <button
                                            type={'submit'}
                                            className="input-icon"
                                            style={{
                                                width: 41
                                            }}
                                        >
                                            <i className="zmdi zmdi-search"/>
                                        </button>
                                    </div>
                                </form>
                            )
                        }}
                    />
                </div>
            </div>
        </div>
    </div>
)

export default SingleSearchForm;