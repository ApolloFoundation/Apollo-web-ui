import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import utils from '../../../../../helpers/util/utils';
import TextualInputComponent from '../../../..//components/form-components/textual-input/textual-input1';
import { getModalDataSelector } from '../../../../../selectors';

export default function ReserveCurrencyForm() {
  const modalData = useSelector(getModalDataSelector);
  const formik = useFormikContext();

  useEffect(() => {
    const amount = parseFloat(formik.values.amount || 0);
    const decimals = parseFloat(modalData.decimals);
    const reserveSupply = parseFloat(modalData.reserveSupply);
    const result = utils.resolverReservePerUnit(decimals, reserveSupply, amount);
    formik.setFieldValue('reserve', result.total)
  }, [formik.values.amount, modalData.decimals]);

  return (
    <>
      <TextualInputComponent
        label="Amount to reserve"
        name="amount"
        placeholder="Amount"
        type="tel"
        code={<span>APL</span>}
      />
    
      <div className="form-group mb-15">
        <label>
          Reserve per unit
        </label>
        <div>
          <span>{formik.values.reserve}</span>
        </div>
      </div>
    </>
  );
}
