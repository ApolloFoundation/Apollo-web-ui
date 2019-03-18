import React, {Component} from 'react';
import AccountRSFormInput from '../../components/form-components/account-rs';
import CustomInputForm from '../../components/form-components/textual-input';

class InputAccounts extends Component {
    state = {
        accounts: ['']
    };

    addAccount = () => {
        this.setState({
            accounts : [...this.state.accounts, '']
        })
    };

    setListValue = (i, setValue) => {
        return (value) => {

            let list = this.state.accounts;
            list[i] = value;

            this.setState({
                accounts: list
            }, () => {
                if (this.props.setValue) {
                    console.log(list);
                    this.props.setValue('controlWhitelisted', list)
                }
            })
        }
    };

    removeListValue = (setValue) => {
        return (index) => {
            let accounts = this.state.accounts;
            
            if (accounts.length > 1) {
                accounts.splice(index, 1);

                this.setState({
                    accounts
                }, () => {
                    if (setValue) {
                        setValue('controlWhitelisted', accounts)
                    }
                })
            }
        }
    }

    render () {
        const {setValue, label, values} = this.props;

        return (
            <>
                {
                    this.state.accounts &&
                    this.state.accounts.map((el, index) => {
                        return (
                            <AccountRSFormInput 
                                setValue={setValue}
                                defaultValue={this.state.accounts[index]}
                                exportAccountList={this.setListValue(index)}
                                handleRemoveItem={this.removeListValue(setValue)}
                                index={index}
                                label={'Accounts (whitelist)'}
                                field={'controlWhitelisted'}
                                noContactList
                            /> 
                        );
                    })
                }
                
                {/* Button */}
                <CustomInputForm 
                    label={'Add account'}
                    type={'button'}
                    hendler={() => this.addAccount()}
                />
            </>
        );
    }
}

export default InputAccounts;