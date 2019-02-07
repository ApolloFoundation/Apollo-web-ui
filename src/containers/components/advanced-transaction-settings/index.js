/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import classNames from "classnames";
import {connect} from 'react-redux';
import AccountRS from '../../components/account-rs';
import InputForm from '../../components/input-form';
import CustomSelect from '../../components/select';
import {Form, Text, TextArea, Checkbox} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";
import {getCurrencyAction} from "../../../actions/currencies";
import {getAssetAction} from "../../../actions/assets";


// Form components
import BlockHeightInput from '../form-components/block-height-input';
import {CheckboxFormInput} from '../form-components/check-button-input';
import CustomInputForm from '../form-components/textual-input';
import CustomTextArea from '../form-components/text-area';
import {TabContainer} from '../form-components/tab-container';
import AccountRSFormInput from '../form-components/account-rs'
import CustomFormSelect from '../form-components/custom-form-select'
import AssetInput from '../form-components/asset-input'
import CurrencyInput from '../form-components/currency-input'

const minBalanceType = [
    { value: '0', label: 'No min balance necessary' },
    { value: '1', label: 'Min balance required' },
    { value: '2', label: 'Min balance of asset quantity required' },
    { value: '3', label: 'Min balance of currency units required' }
];
const phasingMinBalanceModel = [
    { value: '0', label: 'No min balance necessary' },
    { value: '1', label: 'Min balance required' },
];
const phasingMinAssetModel = [
    { value: '0', label: 'No min balance necessary' },
    { value: '1', label: 'Min balance of asset quantity required' },
];
const phasingMinCurrencyModel = [
    { value: '0', label: 'No min balance necessary' },
    { value: '1', label: 'Min balance of currency units required' },
];


const hashAlgorithm = [
    { value: '2', label: 'SHA256' },
    { value: '6', label: 'RIPEMD160' },
    { value: '62', label: 'RIPEMD160_SHA256' }
];

const mapDispatchToProps = dispatch => ({
    getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams))
});

class AdvancedSettings extends React.Component {

    state = {
        activeTab: 0,
        currency: '-',
        block: null,
        accounts: {
            5: [
                ''
            ],
            2: [
                ''
            ],
            3: [
                ''
            ],
            4: [
                ''
            ]
        }
    };

    handleFormSubmit = (values) => {
        Object.keys(values).map((el) => {
            this.props.setValue(el, values[el]);
        });
    };

    handleTabChange = (tab) => {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    };

    componentDidMount = () => {
        this.getBlock();
    };

    getBlock = async (reqParams) => {
        const block = await this.props.getBlockAction(reqParams);
        if (block) {
            this.setState({
                block: block
            })
        }
    };

    handleNotBroadcast = (value) => {
        if (value === false) {
            this.props.setValue('doNotSign', false);
        }
    };

    handleAddNote = (value) => {
        if (value === false) {
            this.props.setValue('note_to_self', '');
        }
    };

    addAccount = (tabIndex) => {
        this.setState({
            accounts: {
                ...this.state.accounts,
                [tabIndex] : [...this.state.accounts[tabIndex], '']
            }
        })
    };

    setListValue = (i, j, setValue) => {
        return (value) => {

            let list = this.state.accounts[i];

            list[j] = value;

            this.setState({
                accounts: {
                    ...this.state.accounts,
                    [i]: list
                }
            }, () => {
                if (setValue) {
                    setValue('phasingWhitelisted', list)
                }
            })
        }
    };

    handleAdvancedState = () => {
		if (this.state.advancedState) {
			this.setState({
				advancedState: false
			})
		} else {
			this.setState({
				advancedState: true
			})
		}
	}
    
    render () {
        const {setValue, values}  = this.props;

        const Tab = ({tab, iconLabel}) => ( 
            <a
                onClick={this.handleTabChange.bind(this, tab)}
                className={classNames({
                    'form-tab': true,
                    'active' : this.state.activeTab === tab
                })}
            >
                <i className={`zmdi ${iconLabel}`} />
            </a>
        )

        const Tabs = () => (
            <div className="form-tab-nav-box form-tab-icons">
                <Tab tab={0} iconLabel={'zmdi-close-circle'}/> 
                <Tab tab={1} iconLabel={'zmdi-spinner'}/> 
                <Tab tab={2} iconLabel={'zmdi-accounts-alt'}/> 
                <Tab tab={3} iconLabel={'zmdi-money-box'}/> 
                <Tab tab={4} iconLabel={'zmdi-chart'}/> 
                <Tab tab={5} iconLabel={'zmdi-balance'}/> 
                <Tab tab={6} iconLabel={'zmdi-thumb-up'}/> 
                <Tab tab={7} iconLabel={'zmdi-help'}/> 
            </div>
        )


        const ReferencedTransactoinHash = () => (
            <CustomInputForm 
                label={'Referenced transaction hash'}
                field="referencedTransactionFullHash"
                placeholder="Referenced transaction hash"
                className={'gray-form'}
                type={"text"}
                setValue={setValue}
            />
        )

        const FinishHeightInput = () => (
            <BlockHeightInput 
                setValue={setValue}
                label={'Finish height'}
                field={'phasingFinishHeight'}
                placeholder={'Finish height'}
                className={'gray-form'}
                deafultPlus={100}
            />
        )

        const BroadcastCheckboxOptions = () => (
            <React.Fragment>
                <CheckboxFormInput 
                    checkboxes={[
                        {
                            field : 'doNotBroadcast',
                            handler : this.handleNotBroadcast,
                            label : 'Do not broadcast'
                        },
                        {
                            field : 'doNotSign',
                            handler : null,
                            label : 'Do not sign'
                        },
                        {
                            field : 'add_note_to_self',
                            handler : this.handleAddNote,
                            label : 'Add note to self?'
                        }
                    ]}
                />
                {
                    values.add_note_to_self &&
                    <CustomTextArea
                        label={'Note to self'}
                        field={'note_to_self'}
                        placeholder={''}
                        note={'This note is encrypted'}
                    />
                }
            </React.Fragment>   
        )

        return (
            <React.Fragment>
                {
                    this.state.advancedState &&
                    <CustomInputForm
                        label={'Deadline (hours)'}
                        fieldType={'counter-number'}
                        type={"tel"}
                        placeholder={'Deadline'}
                        field={'deadline'}
                        setValue={setValue}
                        code={'hours'}										
                    />
                }

                {/* Buttons for hendling of advanced state */}
                <div className="btn-box align-buttons-inside absolute left-conner">
                    <a
                        onClick={this.handleAdvancedState}
                        className="btn btn-right round round-bottom-left round-top-right absolute"
                        style={{left : 0, right: 'auto'}}
                    >
                        {this.state.advancedState ? "Basic" : "Advanced"}
                    </a>
                </div>
                <div
                    className={classNames({
                        'form-tabulator': true,
                        'active': this.state.advancedState,
                        'white': this.props.white
                    })}
                >
                    {/* Refactored */}
                    <Tabs />   
                    
                    <TabContainer
                        active={this.state.activeTab === 0}
                    >
                        {ReferencedTransactoinHash()}
                        <BroadcastCheckboxOptions />
                        
                    </TabContainer>
                    
                    <TabContainer
                        active={this.state.activeTab === 1}
                    >
                        {FinishHeightInput()}
                        {ReferencedTransactoinHash()}
                        <BroadcastCheckboxOptions />
                    </TabContainer>
                    
                    <TabContainer
                        active={this.state.activeTab === 2}
                    >
                        <CustomInputForm 
                            label={'Number of accounts'}
                            setValue={setValue}
                            placeholder={'Number of accounts'}
                            field={'phasingQuorum'}
                            type={'tel'}
                            className={'gray-form'}
                        />

                        {FinishHeightInput()}

                        {
                            this.state.accounts[2] &&
                            this.state.accounts[2].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        setValue={setValue}
                                        exportAccountList={this.setListValue(2, index)}
                                        label={'Accounts (whitelist)'}
                                        field={'phasingWhitelisted'}
                                    />
                                );
                            })
                        }
                        
                        {/* Button */}
                        <CustomInputForm 
                            label={'Add account'}
                            type={'button'}
                            hendler={() => this.addAccount(2)}
                        />

                        <CustomFormSelect
                            defaultValue={minBalanceType[0]}
                            setValue={setValue}
                            options={minBalanceType}
                            label={'Min balance type'}
                            field={'phasingMinBalanceModel'}
                        />
                        
                        {
                            values.phasingMinBalanceModel >= 1 &&
                            <CustomInputForm 
                                label={'Number of accounts'}
                                setValue={setValue}
                                placeholder={'Number of accounts'}
                                field={'phasingQuorum'}
                                type={'text'}
                            />
                        }
                        {
                            values.phasingMinBalanceModel == 2 &&
                            <AssetInput 
                                field={'phasingHoldingCurrencyCode'}
                                setValue={setValue}
                            />
                        }
                        {
                            values.phasingMinBalanceModel == 3 &&
                            <CurrencyInput 
                                setValue={setValue}
                                field={'phasingHoldingCurrencyCode'}
                            />
                        }
                        {ReferencedTransactoinHash()}
                        <BroadcastCheckboxOptions />
                    </TabContainer>

                    <TabContainer active={this.state.activeTab === 3}>
                        <CustomInputForm 
                            label={'Amount'}
                            setValue={setValue}
                            placeholder={'Amount'}
                            field={'phasingQuorumAPL'}
                            fieldType={'counter-number'}
                            code={'APL'}
                            type={'tel'}
                        />

                        {FinishHeightInput()}                    

                        {
                            this.state.accounts[3] &&
                            this.state.accounts[3].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        setValue={setValue}
                                        exportAccountList={this.setListValue(3, index)}
                                        label={'Accounts (whitelist)'}
                                        field={'phasingWhitelisted'}
                                    />
                                );
                            })
                        }

                        <CustomInputForm 
                            label={'Add account'}
                            type={'button'}
                            hendler={() => this.addAccount(3)}
                        />

                        <CustomFormSelect
                            field={'phasingMinBalanceModel'}
                            defaultValue={phasingMinBalanceModel[0]}
                            setValue={setValue}
                            options={phasingMinBalanceModel}
                            label={'Min balance type'}
                        />
                        
                        {
                            values.phasingMinBalanceModel === '1' &&
                            <CustomInputForm 
                                label={'Minimum Balance'}
                                setValue={setValue}
                                placeholder={'Amount'}
                                field={'phasingMinBalanceAPL'}
                                fieldType={'counter-number'}
                                code={'APL'}
                                type={'tel'}
                            />
                        }
                        
                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />
                    </TabContainer>

                    <TabContainer active={this.state.activeTab === 4}>
                        <CustomInputForm 
                            label={'Asset quantity'}
                            setValue={setValue}
                            placeholder={'Asset quantity'}
                            field={'phasingQuorumATUf'}
                            fieldType={'counter-number'}
                            defaultValue={this.state.block ? this.state.block.height : ''}
                            type={'tel'}
                        />

                        {FinishHeightInput()}                    

                        <CustomInputForm 
                            label={'Asset'}
                            setValue={setValue}
                            placeholder={'AssetID'}
                            field={'phasingHolding'}
                            type={'text'}
                        />

                        {
                            this.state.accounts[4] &&
                            this.state.accounts[4].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        setValue={setValue}
                                        exportAccountList={this.setListValue(4, index)}
                                        label={'Accounts (whitelist)'}
                                        field={'phasingWhitelisted'}
                                    />
                                );
                            })
                        }

                        {/* Button */}
                        <CustomInputForm 
                            label={'Add account'}
                            type={'button'}
                            hendler={() => this.addAccount(4)}
                        />

                        <CustomFormSelect
                            field={'phasingMinBalanceModel'}
                            defaultValue={phasingMinBalanceModel[0]}
                            setValue={setValue}
                            options={phasingMinBalanceModel}
                            label={'Min balance type'}
                        />

                        {
                            values.phasingMinBalanceModel === '1' &&
                            <CustomInputForm 
                                label={'Minimum Balance'}
                                setValue={setValue}
                                placeholder={'Amount'}
                                field={'phasingMinBalanceAPL'}
                                fieldType={'counter-number'}
                                code={'APL'}
                                type={'tel'}
                            />
                        }

                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />

                    </TabContainer>

                    <TabContainer active={this.state.activeTab === 5}>
                        <CustomInputForm 
                            label={'Currency units'}
                            setValue={setValue}
                            placeholder={'Currency units'}
                            field={'phasingQuorumATUf'}
                            fieldType={'counter-number'}
                            code={'Units'}
                            type={'tel'}
                        />

                        {FinishHeightInput()}                    

                        <CurrencyInput 
                            setValue={setValue}
                            field={'phasingHoldingCurrencyCode'}
                        />

                        {
                            this.state.accounts[5] &&
                            this.state.accounts[5].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        setValue={setValue}
                                        exportAccountList={this.setListValue(5, index)}
                                        label={'Accounts (whitelist)'}
                                        field={'phasingWhitelisted'}
                                    />
                                );
                            })
                        }

                        {/* Button */}
                        <CustomInputForm 
                            label={'Add account'}
                            type={'button'}
                            hendler={() => this.addAccount(5)}
                        />

                        <CustomFormSelect
                            defaultValue={phasingMinCurrencyModel[0]}
                            setValue={setValue}
                            options={phasingMinCurrencyModel}
                            label={'Min balance type'}
                            field={'phasingMinBalanceModel'}
                        />

                        {
                            values.phasingMinBalanceModel === '1' &&
                            <CustomInputForm 
                                label={'Minimum Balance'}
                                setValue={setValue}
                                placeholder={'Amount'}
                                field={'phasingMinBalanceAPL'}
                                fieldType={'counter-number'}
                                code={'APL'}
                                type={'tel'}
                            />
                        }

                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />

                    </TabContainer>

                    <TabContainer active={this.state.activeTab === 6}>
                        {FinishHeightInput()}                    
                        <CustomInputForm 
                            label={'Approved by transaction hash'}
                            setValue={setValue}
                            placeholder={'Full hash of transaction'}
                            field={'phasingLinkedFullHash'}
                            type={'text'}
                        />

                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />

                    </TabContainer>
                        
                    <TabContainer active={this.state.activeTab === 7}>
                        {FinishHeightInput()} 
                        <CustomInputForm 
                            label={'Approved by hash secret'}
                            setValue={setValue}
                            placeholder={'Hash of secret'}
                            field={'phasingHashedSecret'}
                            type={'text'}
                        />
                        <CustomFormSelect
                            defaultValue={hashAlgorithm[0]}
                            setValue={setValue}
                            options={hashAlgorithm}
                            label={'Hash algorithm'}
                            field={'phasingHashedSecretAlgorithm'}
                        />
                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions/>
                    </TabContainer>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, mapDispatchToProps)(AdvancedSettings);