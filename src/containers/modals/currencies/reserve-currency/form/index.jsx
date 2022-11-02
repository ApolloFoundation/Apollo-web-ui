import React from 'react';
import { Form } from 'react-form';
import classNames from 'classnames';
import InputForm from '../../../components/input-form';
import ModalFooter from '../../../components/modal-footer';
import ButtonWrapper from '../../mandatory-approval/components/ModalFooter';
import utils from '../../../../helpers/util/utils';
import CancelButton from '../../mandatory-approval/components/CancelButton';
import FeeCalc from '../../../../components/form-components/fee-calc';

export default function ReserveCurrencyForm() {
  return (
    <Form
      onSubmit={this.handleFormSubmit}
      render={({ submitForm, values, setValue, getFormState }) => (
        <>
          <div className="form-group mb-15">
            <label>
              Amount to reserve
            </label>
            <div className="input-group">
              <InputForm
                defaultValue=""
                field="amount"
                placeholder="Amount"
                type="tel"
                onChange={value => {
                  const amount = parseFloat(value || 0);
                  const decimals = parseFloat(modalData.decimals);
                  const reserveSupply = parseFloat(modalData.reserveSupply);
                  const result = utils.resolverReservePerUnit(decimals, reserveSupply, amount);
                  this.setState({ reserve: result.total });
                }}
                setValue={setValue}
              />
              <div className="input-group-append">
                <span className="input-group-text">APL</span>
              </div>
            </div>
          </div>
          <div className="form-group mb-15">
            <label>
              Reserve per unit
            </label>
            <div>
              <span>{this.state.reserve}</span>
            </div>
          </div>
          <FeeCalc
            values={getFormState().values}
            setValue={setValue}
            requestType="currencyReserveIncrease"
            defaultValue={1}
          />
          <ModalFooter
            setValue={setValue}
            getFormState={getFormState}
            values={values}
          />
          <ButtonWrapper>
            <CancelButton
              close={closeModal}
            />
            <button
              type="submit"
              className={classNames({
                'btn btn-green submit-button': true,
                'loading btn-green-disabled': isPending,
              })}
              onClick={submitForm}
            >
              <div className="button-loader">
                <div className="ball-pulse">
                  <div />
                  <div />
                  <div />
                </div>
              </div>
              <span className="button-text">Reserve</span>
            </button>
          </ButtonWrapper>
        </>
      )}
    />
  );
}
