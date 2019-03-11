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
    {value: '1', label: 'Min Balance of currency units required'},
];

export default class ApproveWithCurrencyBody extends React.Component {
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
                    label={'Currency units'}
                    field={'currencyUnits'}
                    placeholder={'Currency units'}
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
            
            // <Form
            //     getApi={form => this.props.setApi(form)}
            //     render={({
            //                  submitForm, values, addValue, removeValue, setValue, getFormState
            //              }) =>
            //         <React.Fragment>
            //             {/* <div className="input-group-app form-group mb-15 display-block inline user">
            //                 <div className="row form-group-grey">
            //                     <label className="col-sm-3 col-form-label">
            //                         Accounts (whitelist)
            //                     </label>
            //                     <div className="col-sm-3 col-md-9">
            //                         <div className="iconned-input-field">
            //                             {this.renderAccounts(setValue)}
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div> */}
            //             {/* <div className="form-group-grey row mb-15">
            //                 <div className="col-sm-9 offset-sm-3">
            //                     <a className="no-margin btn static blue"
            //                        onClick={() => {
            //                            this.setState({
            //                                accounts: [...this.state.accounts, ""]
            //                            })
            //                        }
            //                        }>
            //                         Add account
            //                     </a>
            //                 </div>
            //             </div>*/}
            //         </React.Fragment>
            //     }
            // />
        );
    }
}