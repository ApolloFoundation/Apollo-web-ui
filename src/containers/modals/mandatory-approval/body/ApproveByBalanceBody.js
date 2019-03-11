import React from "react";
import AccountRS from "../../../components/account-rs";
import {Form} from "react-form";
import InputForm from "../../../components/input-form";
import CustomSelect from "../../../components/select";
import ModalFooter from "../../../components/modal-footer";

import ModalBody from '../../../components/modals/modal-body'
import TextualInputForm from '../../../components/form-components/textual-input';
import NumericInputForm from '../../../components/form-components/numeric-input';
import CustomFormSelect from '../../../components/form-components/custom-form-select';
import InputAccounts from '../../../components/form-components/input-accounts';

const minBalanceType = [
    {value: '0', label: 'No min balance necessary'},
];

export default class ApproveByBalanceBody extends React.Component {
    state = {
        accounts: [
            ""
        ]
    };

    renderAccounts = setValue => this.state.accounts.map(account => <AccountRS
        value={account}
        field={'phasingWhitelisted'}
        setValue={setValue}
    />);

    render() {
        return (
            <ModalBody
                isPour
                modalTitle={'Process without approval'}
                submitButtonName={'Submit'}
                className={'transparent'}
                isFee
                handleFormSubmit={(values) => this.enterAccount(values)}
            >
                <NumericInputForm
                    label={'Amount'}
                    field={'amount'}
                    placeholder={'Amount'}
                />

                <InputAccounts />

                <CustomFormSelect
                    defaultValue={minBalanceType[0]}
                    options={minBalanceType}
                    label={'Min balance type'}
                    field={'phasingMinBalanceModel'}
                />

                {/* <BlockHeightInput 
                    setValue={setValue}
                    label={'Minimum and maximum phasing durations'}
                    field={'phasingFinishHeight'}
                    placeholder={'Finish height'}
                    className={'gray-form'}
                    deafultPlus={100}
                /> */}

                <NumericInputForm
                    label={'Minimum phasing durations'}
                    field={'minDuration'}
                    placeholder={'Max duration'}
                    countingTtile={'Blocks'}
                />

                <NumericInputForm
                    label={'Maximum phasing durations'}
                    field={'maxDuration'}
                    placeholder={'Max duration'}
                    countingTtile={'Blocks'}
                />

                <TextualInputForm
                    label={'Max pending transactions fees'}
                    field="maxFees"
                    placeholder="Max fees"
                    type={"number"}
                    countingTtile={'Apollo'}
                />
            </ModalBody>
        );
    }
}