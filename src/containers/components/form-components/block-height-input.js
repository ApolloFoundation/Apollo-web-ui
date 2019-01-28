import React from 'react';
import InputForm from '../../components/input-form';
import {connect} from 'react-redux';

const BlockHeightInput = ({setValue, label, actualBlock, field, placeholder}) => (
    <div className="form-group row form-group-white mb-15">
        <label className="col-sm-3 col-form-label">
            {label}
        </label>
        <div className="col-sm-9 input-group">
            <InputForm
                type={"tel"}
                field={field}
                placeholder={placeholder}
                defaultValue={actualBlock + 10000}
                setValue={setValue}
            />
            <div className="input-group-append">
                <span className="input-group-text" id="finishHeightText">{actualBlock}</span>
            </div>
        </div>
        {/*<div className="col-sm-12 form-sub-title block align-right align-margin-top">
            2018/06/19 09:32 am
        </div>*/}
    </div>
)

const mapStateToProps = state => ({
    actualBlock: state.account.actualBlock,
})

export default connect(mapStateToProps)(BlockHeightInput);