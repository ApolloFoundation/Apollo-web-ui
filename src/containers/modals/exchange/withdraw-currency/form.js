import React from 'react';
import {connect} from 'react-redux';
import NummericInputForm from '../../../components/form-components/numeric-input';
import InputForm from "../../../components/input-form";

const WithdrawForm = ({ setValue, modalData, idGroup }) => (
    <>
        <div className="form-group row form-group-white mb-15">
            <label className="col-sm-3 col-form-label">
                From
            </label>
            <div className="col-sm-9">
                <InputForm
                    defaultValue={modalData.address}
                    field="from"
                    placeholder="From"
                    setValue={setValue}
                />
            </div>
        </div>
        <div className="form-group row form-group-white mb-15">
            <label className="col-sm-3 col-form-label">
                To
            </label>
            <div className="col-sm-9">
                <InputForm
                    field="to"
                    placeholder="To"
                    setValue={setValue}
                />
            </div>
        </div>
        <NummericInputForm
            field={'amount'}
            counterLabel={modalData.currency.toUpperCase()}
            type={'tel'}
            label={'Amount'}
            placeholder={'Amount'}
            setValue={setValue}
            idGroup={idGroup}
        />
    </>
);

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});


export default connect(mapStateToProps)(WithdrawForm);