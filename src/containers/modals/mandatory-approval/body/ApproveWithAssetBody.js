import React from "react";
import AccountRS from "../../../components/account-rs";


import ModalBody from '../../../components/modals/modal-body'
import NumericInputForm from '../../../components/form-components/numeric-input';
import CustomFormSelect from '../../../components/form-components/custom-form-select';
import InputAccounts from '../../../components/form-components/input-accounts';
import AssetInput from '../../../components/form-components/asset-input';

const minBalanceType = [
    {value: '0', label: 'No min balance necessary'},
    {value: '1', label: 'Min balance of asset quantity required'},
];
// TODO update
export default class ApproveWithAssetBody extends React.Component {
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
                className={'transparent'}
                isFee
                isDisableFormFooter
                isDisabledBackArrow
                onChange={this.props.onChange}
            >
                <NumericInputForm
                    label={'Asset Quantity'}
                    field={'assetQuantity'}
                    placeholder={'Asset Quantity'}
                />

                <AssetInput
                    field={'controlHolding'}
                />

                <InputAccounts/>

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
