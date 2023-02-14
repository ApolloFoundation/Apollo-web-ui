import React, { useRef, useCallback, useEffect } from 'react';
import { Field, FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { NotificationManager } from "react-notifications";
import { getTransactionAction } from "actions/transactions";
import { getBlockAction } from "actions/blocks";
import { getAccountInfoAction } from "actions/account";
import { setBodyModalParamsAction } from "modules/modals";
import IconndeButton from '../../iconned-button';

export const InputSearchForm = ({ searching, setSearching }) => {
  const dispatch = useDispatch();
  const refSearchInput = useRef();

  const handleClickOutside = useCallback((event) => {
    if (searching && refSearchInput && !refSearchInput.current.contains(event.target)) {
        setSearching(false);
    }
  }, [searching, refSearchInput]);

  const handleSearchind = useCallback((values) => {
    const transaction = dispatch(getTransactionAction({transaction: values.value}));
    const block = dispatch(getBlockAction({block: values.value}));
    const account = dispatch(getAccountInfoAction({account: values.value}));

    Promise.all([transaction, block, account])
        .then((res) => {
            const modals = ['INFO_TRANSACTION', 'INFO_BLOCK', 'INFO_ACCOUNT'];

            // check result for some objects instead of undefined
            const result = res.find((el, index) => {
                if (el) {
                    const payload = index < 2 ? el : el.account;
                    dispatch(setBodyModalParamsAction(modals[index], payload));
                    return el;
                }
            });

            // if every element of response are undefined we make error notification about it
            if (!result) {
                NotificationManager.error('Invalid search properties.', null, 5000);
            }
        });
  }, [dispatch]);

  const handleSubmit = useCallback((values) => {
    if(!searching) {
        setSearching(true);
    } else {
        handleSearchind(values);
    }
  }, [searching, handleSearchind]);

  const formik = useFormik({
    initialValues: {
      value: '',
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [handleClickOutside]);

  return (
    <FormikProvider value={formik}>
      <div ref={refSearchInput} className='searching-window-wrap'>
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
}