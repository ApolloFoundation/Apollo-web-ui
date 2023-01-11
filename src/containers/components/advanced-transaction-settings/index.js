/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import classNames from "classnames";
import {connect} from 'react-redux';
import {getBlockAction} from "../../../actions/blocks";
import {getCurrencyAction} from "../../../actions/currencies";
import {getAssetAction} from "../../../actions/assets";


// Form components
import BlockHeightInput from '../form-components/BlockHeight/block-height-input1';
import CheckboxFormInput from '../check-button-input/CheckboxWithFormik';
import CustomInputForm from '../form-components/TextualInput';
import CustomTextArea from '../form-components/TextArea/TextAreaWithFormik';
import {TabContainer} from '../form-components/TabContainer/tab-container';
import AccountRSFormInput from '../form-components/AccountRS'
import CustomFormSelect from '../select'
import { AssetInput } from '../form-components/AssetInput'
import CurrencyInput from '../form-components/CurrencyInput'

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
// TODO unused
class AdvancedSettings extends React.Component {
    state = {
        activeTab: 0,
        currency: '-',
        block: null,
        accounts: {
            5: [''],
            2: [''],
            3: [''],
            4: ['']
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

    // handleNotBroadcast = (value) => {
    //     if (value === false) {
    //         this.props.setValue('doNotSign', false);
    //     }
    // };

    // handleAddNote = (value) => {
    //     if (value === false) {
    //         this.props.setValue('note_to_self', '');
    //     }
    // };

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

    removeListValue = (group, setValue) => {
        return (index) => {
            let accounts = this.state.accounts[group];
            
            if (accounts.length > 1) {
                accounts.splice(index, 1);

                this.setState({
                    accounts: {
                        ...this.state.accounts,
                        [group]: accounts
                    }
                }, () => {
                    if (setValue) {
                        setValue('phasingWhitelisted', accounts)
                    }
                })
            }
        }
    }

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
    
    onFocus = (model) => {
        this.props.setValue('phasingVotingModel', model)
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
                label='Referenced transaction hash'
                name="referencedTransactionFullHash"
                placeholder="Referenced transaction hash"
                className={this.props.white ?  '' : 'gray-form'}
                type="text"
            />
        )

        const FinishHeightInput = () => (
            <BlockHeightInput 
                label='Finish height'
                field='phasingFinishHeight'
                placeholder='Finish height'
                className={this.props.white ?  '' : 'gray-form'}
            />
        )

        const BroadcastCheckboxOptions = () => (
            <React.Fragment>
                <CheckboxFormInput
                    nme="doNotBroadcast"
                    label="Do not broadcast"
                    id="doNotBroadcastCheckbox"
                />
                <CheckboxFormInput
                    nme="doNotSign"
                    label="Do not sign"
                    id="doNotSignCheckbox"
                />
                <CheckboxFormInput
                    nme="add_note_to_self"
                    label="Add note to self?"
                    id="add_note_to_selfCheckbox"
                />
                {
                    values.add_note_to_self &&
                    <CustomTextArea
                        label='Note to self'
                        name='note_to_self'
                        note='This note is encrypted'
                    />
                }
            </React.Fragment>   
        )

        return (
            <React.Fragment>
                {
                    this.state.advancedState &&
                    <CustomInputForm
                        label='Deadline (hours)'
                        fieldType='counter-number'
                        type="tel"
                        placeholder='Deadline'
                        name='deadline'
                        code='hours'
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
                        onFocus={() => this.onFocus(0)}
                    >
                        <CustomInputForm 
                            label='Number of accounts'
                            placeholder='Number of accounts'
                            name='phasingQuorum'
                            type='tel'
                            className={this.props.white ?  '' : 'gray-form'}
                        />

                        {FinishHeightInput()}

                        {
                            this.state.accounts[2] &&
                            this.state.accounts[2].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        defaultValue={this.state.accounts[2][index]}
                                        exportAccountList={this.setListValue(2, index)}
                                        handleRemoveItem={this.removeListValue(2, setValue)}
                                        index={index}
                                        label='Accounts (whitelist)'
                                        name='phasingWhitelisted'
                                        noContactList
                                    />
                                );
                            })
                        }
                        
                        {/* Button */}
                        <CustomInputForm 
                            label='Add account'
                            type='button'
                            hendler={() => this.addAccount(2)}
                        />

                        <CustomFormSelect
                            defaultValue={minBalanceType[0]}
                            options={minBalanceType}
                            label='Min balance type'
                            name='phasingMinBalanceModel'
                        />
                        
                        {
                            values.phasingMinBalanceModel >= 1 &&
                            <CustomInputForm 
                                label='Number of accounts'
                                placeholder='Number of accounts'
                                name='phasingQuorum'
                                type='text'
                            />
                        }
                        {
                            values.phasingMinBalanceModel == 2 &&
                            <AssetInput name='phasingHoldingCurrencyCode' />
                        }
                        {
                            values.phasingMinBalanceModel == 3 &&
                            <CurrencyInput name='phasingHoldingCurrencyCode' />
                        }
                        {ReferencedTransactoinHash()}
                        <BroadcastCheckboxOptions />
                    </TabContainer>

                    <TabContainer 
                        active={this.state.activeTab === 3}
                        onFocus={() => this.onFocus(1)}                        
                    >
                        <CustomInputForm 
                            label='Amount'
                            placeholder='Amount'
                            className={this.props.white ?  '' : 'gray-form'}
                            name='phasingQuorumAPL'
                            code='APL'
                            type='tel'
                        />

                        {FinishHeightInput()}                    

                        {
                            this.state.accounts[3] &&
                            this.state.accounts[3].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        defaultValue={this.state.accounts[2][index]}
                                        exportAccountList={this.setListValue(3, index)}
                                        handleRemoveItem={this.removeListValue(3, setValue)}
                                        index={index}
                                        label='Accounts (whitelist)'
                                        name='phasingWhitelisted'
                                        noContactList
                                    />
                                );
                            })
                        }

                        <CustomInputForm 
                            label='Add account'
                            type='button'
                            hendler={() => this.addAccount(3)}
                        />

                        <CustomFormSelect
                            name='phasingMinBalanceModel'
                            defaultValue={phasingMinBalanceModel[0]}
                            options={phasingMinBalanceModel}
                            label='Min balance type'
                        />
                        
                        {
                            values.phasingMinBalanceModel === '1' &&
                            <CustomInputForm 
                                label='Minimum Balance'
                                placeholder='Amount'
                                name='phasingMinBalanceAPL'
                                code='APL'
                                type='tel'
                            />
                        }
                        
                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />
                    </TabContainer>

                    <TabContainer 
                        active={this.state.activeTab === 4}
                        onFocus={() => this.onFocus(2)}
                    
                    >
                        <CustomInputForm 
                            label='Asset quantity'
                            placeholder='Asset quantity'
                            name='phasingQuorum'
                            className={this.props.white ?  '' : 'gray-form'}
                            defaultValue={this.state.block ? this.state.block.height : ''}
                            type='tel'
                        />

                        {FinishHeightInput()}

                        <AssetInput name='phasingHolding' />

                        {
                            this.state.accounts[4] &&
                            this.state.accounts[4].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        defaultValue={this.state.accounts[2][index]}
                                        exportAccountList={this.setListValue(4, index)}
                                        handleRemoveItem={this.removeListValue(4, setValue)}
                                        index={index}
                                        label='Accounts (whitelist)'
                                        field='phasingWhitelisted'
                                        noContactList
                                    />
                                );
                            })
                        }

                        {/* Button */}
                        <CustomInputForm 
                            label='Add account'
                            type='button'
                            hendler={() => this.addAccount(4)}
                        />

                        <CustomFormSelect
                            name='phasingMinBalanceModel'
                            defaultValue={phasingMinBalanceModel[0]}
                            options={phasingMinBalanceModel}
                            label='Min balance type'
                        />

                        {
                            values.phasingMinBalanceModel === '1' &&
                            <CustomInputForm 
                                label='Minimum Balance'
                                placeholder='Amount'
                                name='phasingMinBalanceAPL'
                                fieldType='counter-number'
                                code='APL'
                                type='tel'
                            />
                        }

                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />

                    </TabContainer>

                    <TabContainer 
                        active={this.state.activeTab === 5}
                        onFocus={() => this.onFocus(3)}                        
                    >
                        <CustomInputForm 
                            label='Currency units'
                            placeholder='Currency units'
                            name='phasingQuorumATUf'
                            className={this.props.white ?  '' : 'gray-form'}
                            // fieldType={'counter-number'}
                            code='Units'
                            type='tel'
                        />

                        {FinishHeightInput()}

                        <CurrencyInput name={'phasingHoldingCurrencyCode'} />

                        {
                            this.state.accounts[5] &&
                            this.state.accounts[5].map((el, index) => {
                                return (
                                    <AccountRSFormInput 
                                        defaultValue={this.state.accounts[2][index]}
                                        exportAccountList={this.setListValue(5, index)}
                                        handleRemoveItem={this.removeListValue(5, setValue)}
                                        index={index}
                                        label='Accounts (whitelist)'
                                        field='phasingWhitelisted'
                                        noContactList
                                    />
                                );
                            })
                        }

                        {/* Button */}
                        <CustomInputForm 
                            label='Add account'
                            type='button'
                            hendler={() => this.addAccount(5)}
                        />

                        <CustomFormSelect
                            defaultValue={phasingMinCurrencyModel[0]}
                            options={phasingMinCurrencyModel}
                            label='Min balance type'
                            name='phasingMinBalanceModel'
                        />

                        {
                            values.phasingMinBalanceModel === '1' &&
                            <CustomInputForm 
                                label='Minimum Balance'
                                placeholder='Amount'
                                name='phasingMinBalanceAPL'
                                // fieldType='counter-number'
                                code='APL'
                                type='tel'
                            />
                        }

                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />

                    </TabContainer>

                    <TabContainer active={this.state.activeTab === 6}>
                        {FinishHeightInput()}                    
                        <CustomInputForm 
                            label='Approved by transaction hash'
                            className={this.props.white ?  '' : 'gray-form'}
                            placeholder='Full hash of transaction'
                            name='phasingLinkedFullHash'
                            type='text'
                        />

                        {ReferencedTransactoinHash()}

                        <BroadcastCheckboxOptions />

                    </TabContainer>
                        
                    <TabContainer active={this.state.activeTab === 7}>
                        {FinishHeightInput()} 
                        <CustomInputForm 
                            className={this.props.white ?  '' : 'gray-form'}
                            label='Approved by hash secret'
                            placeholder='Hash of secret'
                            field='phasingHashedSecret'
                            type='text'
                        />
                        <CustomFormSelect
                            defaultValue={hashAlgorithm[0]}
                            options={hashAlgorithm}
                            label='Hash algorithm'
                            name='phasingHashedSecretAlgorithm'
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