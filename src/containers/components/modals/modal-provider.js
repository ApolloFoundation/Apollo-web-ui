import React from 'react';
import {processForm} from '../../../actions/forms';
import {connect} from 'react-redux';
import store from '../../../store';
 

const ModalProvider = ({children}) => (
    <>
        {
            React.Children.map(children, child => {
                    if (child) {
                        return React.cloneElement(child, {processForm, store})
                    }
                }
            )
        }
    </>
)

export default connect(null, null)(ModalProvider)