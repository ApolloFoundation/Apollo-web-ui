import React from "react";
import InputForm from "../../../components/input-form";
import {Checkbox, TextArea, Form} from "react-form";
import {NotificationManager} from "react-notifications";
import ModalFooter from "../../../components/modal-footer";

export default class NoApprovalBody extends React.Component {
    render() {
        return (
            <Form
                getApi={form => {
                    this.props.setApi(form);
                }}
                render={({
                             submitForm, values, addValue, removeValue, setValue, getFormState
                         }) => <React.Fragment>
                    <p className="mb-3">
                        Process without approval
                    </p>
                    <div className="form-group form-group-white row mb-15">
                        <label className="col-sm-3 col-form-label">
                            Amount
                        </label>
                        <div className="col-sm-3 input-group input-group-text-transparent input-group-sm">
                            <InputForm
                                defaultValue={''}
                                field="fee"
                                placeholder="Amount"
                                type="float"
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