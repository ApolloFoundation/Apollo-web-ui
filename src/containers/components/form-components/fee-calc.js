import React from 'react';
import InputForm from '../input-form';

export const FeeCalc = ({setValue, }) => {
    return (
        <div className="form-group row form-group-white mb-15">
            <label className="col-sm-3 col-form-label">
                Fee
                <span
                    onClick={async () => {
                        setValue("feeAPL", 1);
                    }}
                    className="calculate-fee"
                >
                Calculate
            </span>
            </label>
            <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                <InputForm
                    field="feeAPL"
                    placeholder="Minimum fee"
                    type={"float"}
                    setValue={setValue}
                />
                <div className="input-group-append">
                    <span className="input-group-text">
                        Apollo
                    </span>
                </div>
            </div>
        </div>
    )
}