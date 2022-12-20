import React from "react";

import AccountRS from "../../../components/account-rs";
import ModalBody from '../../../components/modals/modal-body'
import NumericInputForm from '../../../components/form-components/numeric-input';
import CustomFormSelect from '../../../components/form-components/custom-form-select';
import InputAccounts from '../../../components/form-components/input-accounts';

const minBalanceType = [
    {value: '0', label: 'No min balance necessary'},
    {value: '1', label: 'Account Balance'},
    {value: '2', label: 'Asset Balance'},
    {value: '3', label: 'Currency Balance'}
];
// TODO update
export default class ApproveByAccountBody extends React.Component {

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
                onChange={this.props.onChange}
                isPour
                className={'transparent'}
                isFee
                isDisableFormFooter
            >
                <NumericInputForm
                    label={'Number of accounts'}
                    field={'controlQuorum'}
                    placeholder={'Number of accounts'}
                />

                <InputAccounts />

                <CustomFormSelect
                    defaultValue={minBalanceType[0]}
                    options={minBalanceType}
                    label={'Min balance type'}
                    field={'phasingMinBalanceModel'}
                />

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

                <NumericInputForm
                    label={'Max pending transactions fees'}
                    field="maxFees"
                    placeholder="Max fees"
                    type={"number"}
                    countingTtile={this.props.ticker}
                />
            </ModalBody>

        );
    }
}
