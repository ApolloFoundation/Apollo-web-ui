import React from "react";
import InputForm from "../../../components/input-form";
import {Checkbox, TextArea, Form} from "react-form";
import {NotificationManager} from "react-notifications";
import ModalFooter from "../../../components/modal-footer";

import ModalBody from '../../../components/modals/modal-body';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';
import NummericFormInput from '../../../components/form-components/numeric-input';

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
                    <NummericFormInput
                        label={'Amount'}
                        placeholder={'Amount'}
                        field={'fee'}
                    />
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