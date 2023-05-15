import React from 'react';
import {connect} from 'react-redux';

import {getAliasAction} from "../../../../actions/aliases";

import CustomFormSelect from '../../../components/form-components/custom-form-select';
import TextualInputComponent from '../../../components/form-components/textual-input';
import AccountRSFormInput from '../../../components/form-components/account-rs';


const typeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

class EditAliasForm extends React.Component {
    state = {inputType: 'uri'};
    
    componentDidMount = () => {
        this.getAlias();
    };

    getAlias = async () => {
        const alias = await this.props.getAliasAction({alias: this.props.modalData});

        if (alias) {
            this.setState({
                alias
            });
        }
    };


    handleChange = (value) => {
        this.setState({
            inputType: value
        })
    };

    render () {
        const {setValue, values} = this.props;
        
        return (
            <>
               <CustomFormSelect
                    defaultValue={typeData[0]}
                    setValue={setValue}
                    options={typeData}
                    label={'Type'}
                    field={'type'}
                    onChange={this.handleChange}
                />
                <TextualInputComponent 
                    label={'Alias'}
                    text={this.state.alias ? this.state.alias.aliasName : ''}
                />
                {
                    this.state.inputType === 'uri' &&
                    <TextualInputComponent 
                        label={'URI'}
                        field="aliasURI"
                        placeholder="http://"
                        type={"text"}
                        setValue={setValue}
                        defaultValue={this.state.alias ? this.state.alias.aliasURI : ''}
                    />
                }
                {
                    this.state.inputType === 'account' &&
                    <AccountRSFormInput
                        field={'aliasURI'}
                        label={'Account ID'}
                        setValue={setValue}
                        defaultValue={values.aliasURI || ''}
                        value={values.aliasURI || ''}
                    />
                }
                {
                    this.state.inputType === 'general' &&
                    <TextualInputComponent 
                        label={'Data'}
                        field="aliasURI"
                        placeholder="Data"
                        type={"text"}
                        setValue={setValue}
                    />
                }

            </>
        )
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditAliasForm);