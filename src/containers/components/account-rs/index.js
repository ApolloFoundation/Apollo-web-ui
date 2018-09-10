import React from 'react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';


class AccountRS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: JSON.parse(localStorage.getItem('APLContacts')),
            inputValue: {
                mask: 'APL-****-****-****-*****',
                value: ''
            },
            isContacts: false
        };
    };


    handleFillForm = (account) => {
        this.props.setValue(this.props.field, account);
        this.refs.input.value = account;
        this.setState({
            isContacts: false,
            // inputValue: account
        })
    };

    handleContacts = () => {
        this.setState({
            isContacts: !this.state.isContacts
        })
    };

    onChange = (event) => {
        const value = event.target.value;
        const newState = {
            mask: 'APL-****-****-****-*****',
            value: value.toUpperCase()
        };

        this.props.setValue(this.props.field, value);
        this.setState({inputValue: newState});
    };

    render () {
        return (
            <React.Fragment>
                {this.state.inputValue &&
                    <InputMask className="form-control"
                               mask={this.state.inputValue.mask}
                               placeholder={'Account RS'}
                               ref={'input'}
                               value={this.state.inputValue.value}
                               onChange={this.onChange}
                    />
                }
                <a
                    onClick={() => this.handleContacts()}
                    className="input-icon"
                >
                    <i className="zmdi zmdi-account" />
                </a>
                <div
                    className={classNames({
                        'contacts-list': true,
                        'active': this.state.isContacts
                    })}
                >
                    <ul>
                        {
                            this.state.contacts &&
                            this.state.contacts.map((el, index) => {
                                return (
                                    <li key={index}>
                                        <a onClick={() => this.handleFillForm(el.accountRS)}>
                                            {el.name}
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </React.Fragment>

        )
    }
}

export default AccountRS;