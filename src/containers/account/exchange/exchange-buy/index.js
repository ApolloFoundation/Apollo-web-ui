import React from 'react';
// import ModalBody from '../../../components/modals/modal-body';
import classNames from 'classnames';

import NummericInputComponent from '../../../components/form-components/numeric-input';
import TextualInputComponent from '../../../components/form-components/textual-input';
import AccountRSFormInput from '../../../components/account-rs'

class ExchangeBuy extends React.Component {

    render () {
        return (
            <div className={'card-block green card card-medium pt-0 h-100'}>
                {/*<ModalBody
                    modalTitle={'Buy ETH'}
                    closeModal={this.props.closeModal}
                    className={'modal-form'}
                    handleFormSubmit={(values) => this.handleValidateToken(values)}
                    isDisabe2FA
                    isPour
                    isDisableSecretPhrase
                    submitButtonName={'Buy'}
                    CustomFooter={() => (
                        <div className="btn-box align-buttons-inside align-center form-footer">
                            <button
                                type="submit"
                                name={'closeModal'}
                                className={classNames({
                                    "btn" : true,
                                    "btn-lg" : true,
                                    "btn-green" : true,
                                    "submit-button" : true,
                                })}
                            >
                                <div
                                    className="button-loader"
                                >
                                    <div className="ball-pulse">
                                        <div/>
                                        <div/>
                                        <div/>
                                    </div>
                                </div>
                                <span className={'button-text'}>
                                    Buy Apollo
                                </span>
                            </button>
                        </div>
                    )}
                >
                    <NummericInputComponent
                        label={'Price'}
                        field='price'
                    />
                    <NummericInputComponent
                        label={'Amount'}
                        field='amount'
                    />
                    <NummericInputComponent
                        label={'Total'}
                        field='total'
                    />
                </ModalBody>*/}
            </div>
        )
    }
}

export default ExchangeBuy;