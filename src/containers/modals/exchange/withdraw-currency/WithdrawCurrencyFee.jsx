import React, { useCallback, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import ContentLoader from "../../../components/content-loader";
import {getTransactionFee } from '../../../../actions/wallet';
import { formatGweiToEth} from '../../../../helpers/format';
import { getConstantsSelector } from '../../../../selectors';

// levels of transactions fee which we get from request and add to transactionFeeData in component
const LEVEL_NAMES = ['safeLow', 'average', 'fast'];

export const WithdrawCurrencyFee = () => {
  const dispatch = useDispatch();
  const formik = useFormikContext();
  const constants = useSelector(getConstantsSelector);

  const [transactionFeeData, setTransactionFeeData] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);

  const getTransactionFeeRequest = useCallback(async () => {
    const transactionFee = await dispatch(getTransactionFee());
    if (transactionFee) {
      const level = Object.keys(transactionFee)[1];
      
      setTransactionFeeData(transactionFee);
      setActiveLevel(Object.keys(transactionFee)[1]);
      // set transferFee manual to the form values
      formik.setFieldValue('transferFee', transactionFee[level]);
    }
  }, [formik.setFieldValue, dispatch]);

  // change active level for local styles and transferFee values for form values
  const handleChangeTransactionFee = (level) => () => {
    setActiveLevel(level);
    formik.setFieldValue('transferFee', transactionFeeData[level]);
  }

  useEffect(() => {
    getTransactionFeeRequest();
  }, [getTransactionFeeRequest]);

  const gasLimit = formik.values.asset?.currency === 'eth' ? constants.gasLimitEth : constants.gasLimitERC20;

  return (
    <>
      <div className="form-group mb-15">
        <label>
            Gas Fee
        </label>
        <div>
            {transactionFeeData ? (
                <div
                  className="btn-group btn-group-switch w-100"
                  role="group"
                  aria-label="Gas Fee"
                >
                    {LEVEL_NAMES.map(transactionFeeLevel => (
                      <button
                        key={transactionFeeLevel}
                        type="button"
                        className={
                          classNames('w-100 p-2 btn btn-secondary btn-grey', {
                            'btn-green': activeLevel === transactionFeeLevel
                          })
                        }
                        onClick={handleChangeTransactionFee(transactionFeeLevel)}
                      >
                        <span className="text-uppercase">{transactionFeeLevel}</span>
                        <small>{formatGweiToEth(transactionFeeData[transactionFeeLevel], 0)} ETH</small>
                      </button>  
                    ))}
                </div>
            ) : (
                <ContentLoader className='m-0 p-0' />
            )}
        </div>
    </div>
    <div className="form-group mb-15">
        <label>
            Max Fee
        </label>
        <div>
            {formik.values.transferFee ? (
                <span>{formatGweiToEth(formik.values.transferFee * gasLimit, 0)} ETH</span>
            ) : (
                <ContentLoader className='m-0 p-0' />
            )}
        </div>
    </div>
    </>
  );
}
