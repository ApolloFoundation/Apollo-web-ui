
import React from 'react';
import {Form, Text} from 'react-form';

export const BlocksForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({submitForm}) => (
        <form
            onSubmit={submitForm}
            className="input-group-app search col-md-3 pl-0"
        >
            <div className="iconned-input-field block">
                <Text
                    placeholder='Block height'
                    field='height'
                    type="text"
                />
                <button
                    type='submit'
                    className="input-icon"
                    style={{width: 41}}
                >
                    <i className="zmdi zmdi-search"/>
                </button>
            </div>
        </form>
      )
    }
  />
);