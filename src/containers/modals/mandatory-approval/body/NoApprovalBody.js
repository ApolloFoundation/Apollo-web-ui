import React from "react";

import ModalBody from '../../../components/modals/modal-body';
import NummericFormInput from '../../../components/form-components/numeric-input';

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
