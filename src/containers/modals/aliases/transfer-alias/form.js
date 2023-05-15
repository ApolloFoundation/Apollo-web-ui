import React from 'react';
import {connect} from 'react-redux';

import TextualInputComponent from '../../../components/form-components/textual-input';
import AccountRSFormInput from '../../../components/form-components/account-rs';

import {CheckboxFormInput} from '../../../components/form-components/check-button-input';
import CustomTextArea from '../../../components/form-components/text-area';
import {getAliasAction} from "../../../../actions/aliases";

class TransferAlias extends React.Component {

    state = {};
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

    render () {
        const {setValue, getFormState} = this.props;
        const {values: {add_message, recipient}} = getFormState();

        return (
            <>
                <TextualInputComponent 
                    label={'Alias'}
                    text={this.state.alias ? this.state.alias.aliasName : ''}
                />

                <AccountRSFormInput
                    field={'recipient'}
                    label={'Recipient'}
                    setValue={setValue}
                    defaultValue={recipient}
                    value={recipient}
                />

                <CheckboxFormInput
                    setValue={setValue}
        
                    label={''}
                    checkboxes={[
                        {
                            label: 'Add a message?',
                            field: 'add_message',
                            // handler : this.setFormState(form)
                        }
                    ]}
                />

                {
                    add_message &&
                    <>
                        <CustomTextArea
                            setValue={setValue}
                            label={'Message'}
                            field={'message'}
                            placeholder={'Message'}
                        />

                        <CheckboxFormInput
                            setValue={setValue}
                
                            label={''}
                            checkboxes={[
                                {
                                    label: 'Encrypt Message',
                                    field: 'encrypt_message',
                                    defaultValue: true
                                },{
                                    label: 'Message is Never Deleted',
                                    field: 'permanent_message',
                                },
                            ]}
                        />
                    </>
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


export default connect(mapStateToProps, mapDispatchToProps)(TransferAlias);