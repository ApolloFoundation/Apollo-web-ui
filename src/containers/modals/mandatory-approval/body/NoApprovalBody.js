import React from "react";
import InputForm from "../../../components/input-form";
import {Checkbox, TextArea, Form} from "react-form";
import {NotificationManager} from "react-notifications";
import ModalFooter from "../../../components/modal-footer";

import ModalBody from '../../../components/modals/modal-body';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';
import NummericFormInput from '../../../components/form-components/numeric-input';
// TODO update
export default class NoApprovalBody extends React.Component {
    render() {
        return (
            <ModalBody
                isPour
                modalTitle={'Process without approval'}
                className={'transparent'}
                onChange={(values) => this.props.onChange(values)}
                isFee
                isDisableFormFooter
                isDisabledBackArrow
            >
                <NummericFormInput
                    label={'Amount'}
                    placeholder={'Amount'}
                    countingTtile={this.props.ticker}
                    field={'fee'}
                />
            </ModalBody>
        );
    }
}
