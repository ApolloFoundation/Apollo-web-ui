import React from "react";
import InputForm from "../../../components/input-form";
import {Checkbox, TextArea, Form} from "react-form";
import {NotificationManager} from "react-notifications";
import ModalFooter from "../../../components/modal-footer";

export default class NoApprovalBody extends React.Component {
    render() {
        return (
            <Form
                render={({
                             submitForm, values, addValue, removeValue, setValue, getFormState
                         }) => <React.Fragment>
                    <p className="mb-3">
                        Process without approval
                    </p>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">
                        </label>
                        <div className="col-sm-3 input-group input-group-text-transparent input-group-sm">
                            <InputForm
                                defaultValue={''}
                                field="fee"
                                placeholder="Amount"
                                type="number"
                                setValue={setValue}/>
                            <div className="input-group-append">
                                <span className="input-group-text">Apollo</span>
                            </div>
                        </div>
                    </div>
                    <ModalFooter
                        setValue={setValue}
                        getFormState={getFormState}
                        values={values}
                    />
                </React.Fragment>}
            />
        );
    }
}