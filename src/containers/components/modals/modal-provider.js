import React from 'react';
import { connect } from 'react-redux';
import { processForm } from 'actions/forms';
import store from 'store';

const ModalProvider = ({ children }) => (
  <>
    {React.Children.map(children, child => {
      if (child) {
        return React.cloneElement(child, { processForm, store });
      }

      return null;
    })}
  </>
);

export default connect(null, null)(ModalProvider);
