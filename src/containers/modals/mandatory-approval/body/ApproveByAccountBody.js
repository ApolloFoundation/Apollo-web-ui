import React from "react";
import {Checkbox, Form, TextArea} from "react-form";
import InputForm from "../../../components/input-form";
import AccountRS from "../../../components/account-rs";
import CustomSelect from "../../../components/select";
import ModalFooter from "../../../components/modal-footer";

const minBalanceType = [
    {value: '0', label: 'No min balance necessary'},
    {value: '1', label: 'Account Balance'},
    {value: '2', label: 'Asset Balance'},
    {value: '3', label: 'Currency Balance'}
];

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
            <Form
                render={({
                             submitForm, values, addValue, removeValue, setValue, getFormState
                         }) =>
                    <React.Fragment>
                        <div className="form-group row form-group-grey mb-15">
                            <label className="col-sm-3 col-form-label">
                                Number of accounts
                            </label>
                            <div className="col-sm-3">
                                <InputForm
                                    type="number"
                                    field="phasingQuorum"
                                    placeholder="Number of accounts"
                                    setValue={setValue}/>
                            </div>
                        </div>
                        <div className="input-group-app form-group mb-15 display-block inline user">
                            <div className="row form-group-grey">
                                <label className="col-sm-3 col-form-label">
                                    Accounts (whitelist)
                                </label>
                                <div className="col-sm-3">
                                    <div className="iconned-input-field">
                                        {this.renderAccounts(setValue)}
                                    </div>
                                </div>
                            </div>
                        </div>
                       {/* <div className="form-group-grey row mb-15">
                            <div className="col-sm-9 offset-sm-3">
                                <a className="no-margin btn static blue"
                                   onClick={() => {
                                       this.setState({
                                           accounts: [...this.state.accounts, ""]
                                       })
                                   }
                                   }>
                                    Add account
                                </a>
                            </div>
                        </div>*/}
                        <div className="form-group row form-group-grey mb-15">
                            <label className="col-sm-3 col-form-label">
                                Min balance type
                            </label>
                            <div className="col-sm-3 mb-0">
                                <div className="form-group-select">
                                    <CustomSelect
                                        className="form-control"
                                        field={'phasingMinBalanceModel'}
                                        defaultValue={minBalanceType[0]}
                                        setValue={setValue}
                                        options={minBalanceType}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label className="col-sm-3 col-form-label">
                                Minimum and maximum phasing durations
                            </label>
                            <div className="col-sm-9">
                                <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                    <InputForm
                                        defaultValue={""}
                                        field="minDuration"
                                        placeholder="Min duration"
                                        type={"number"}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">Blocks</span>
                                    </div>
                                </div>
                                <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                    <InputForm
                                        defaultValue={""}
                                        field="maxDuration"
                                        placeholder="Max duration"
                                        type={"number"}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">Blocks</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row form-group-grey mb-15">
                            <label className="col-sm-3 col-form-label">
                                Max pending transactions fees
                            </label>
                            <div className="col-sm-9">
                                <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                    <InputForm
                                        defaultValue={""}
                                        field="maxFees"
                                        placeholder="Max fees"
                                        type={"number"}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">Apollo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                                Fee
                            </label>
                            <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
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
                    </React.Fragment>
                }
            />
        );
    }
}