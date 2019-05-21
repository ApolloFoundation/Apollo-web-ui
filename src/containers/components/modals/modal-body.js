import React from 'react';
import {Form} from 'react-form';

import {connect} from 'react-redux';
import FormFooter from '../form-components/form-footer';
import InputForm from '../input-form';
import ModalFooter from '../modal-footer';
import classNames from 'classnames';
import {ONE_APL} from '../../../constants';

import AdvancedSettings from '../advanced-transaction-settings';
import {setBodyModalParamsAction, saveSendModalState, openPrevModal} from "../../../modules/modals";

import BackForm from '../../../containers/modals/modal-form/modal-form-container';
import NummericInputForm from "../form-components/numeric-input";


class ModalBody extends React.Component {

    getForm = (form) => {
        if (this.props.loadForm) {
            this.props.loadForm(form)
        } else {
            this.setState({form}, () => this.loadValues());
        }
    };

	loadValues = (values) => {
		if (values) {
			this.state.form.setAllValues(values);
			return;
        } else {
            const {modalsHistory} = this.props;
            if (modalsHistory[modalsHistory.length - 1] && modalsHistory[modalsHistory.length - 1].value) {
                this.state.form.setAllValues(modalsHistory[modalsHistory.length - 1].value)
            }
        }
    };

    handleFormSubmit = (values) => {
        if (this.props.handleFormSubmit) {
            this.props.handleFormSubmit(values)
        }
    }

    form = () => {
        const {CustomFooter, isDisableFormFooter, marketplace, onChange, isDisabledBackArrow, isAdvancedWhite,
            isDisableSecretPhrase, isDisabe2FA, modalSubTitle, className, idGroup, isPour, openPrevModal, modalsHistory,
            saveSendModalState, nameModel, children, handleFormSubmit, modalTitle, isPending, isFee, closeModal,
            submitButtonName, modalData} = this.props;

        const LeftBar  = marketplace ? (p) => <div className="left-bar">{p.children}</div> : React.Fragment ;
        const RightBar = marketplace ? (p) => <div className="right-bar">{p.children}</div> : React.Fragment ;
        const isAdvanced = false;

        return (
                <BackForm
                    getApi={(value) => this.getForm(value)}
                    onChange={onChange}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    nameModel={nameModel}
                    render={({
                            submitForm, values, addValue, removeValue, setValue, getFormState, getValue
                    }) => (
                        <form
                            onChange={() => saveSendModalState(values)}
                            onSubmit={submitForm}
                            className={`${isPour ? '' : 'modal-form modal-send-apollo'} ${className}`}
                        >
                            <div className={`form-group-app ${marketplace ? 'devided p-0' : ''}`}>
                                <LeftBar>
                                    {
                                        marketplace &&
                                        <>
                                            <div className="top-bar">
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${marketplace.image})`
                                                    }}
                                                    className={classNames({
                                                        "marketplace-image": true,
                                                        "no-image": !marketplace.hasImage
                                                    })}
                                                />
                                                </div>
                                                <div className="bottom-bar">
                                                <div className="description word-brake">
                                                    {marketplace.description}
                                                </div>
                                            </div>
                                        </>
                                    }

                                </LeftBar>
                                <RightBar>
                                    {
                                        closeModal && !isPour &&
                                        <a onClick={closeModal} className="exit"><i className="zmdi zmdi-close" /></a>
                                    }

                                    {
                                        modalTitle &&
                                        <div className="form-title">
                                            {
                                                !isDisabledBackArrow &&
                                                modalsHistory.length > 1 &&
                                                <div className={"backMy"} onClick={() => {openPrevModal()}}/>
                                            }
                                            <p>{modalTitle}</p>
                                        </div>
                                    }

                                    {
                                        marketplace &&
                                        <div className="form-title">
                                            {
                                                !isDisabledBackArrow &&
                                                modalsHistory.length > 1 &&
                                                <div className={"backMy"} onClick={() => {openPrevModal()}}/>
                                            }
                                            <p>{marketplace.name}</p>
                                        </div>
                                    }

                                    {
                                        marketplace && marketplace.name &&
                                        <div className="price">
                                            {marketplace.priceATM / ONE_APL} Apollo
                                        </div>
                                    }



                                    {
                                        modalSubTitle &&
                                        <div className="form-sub-title mb-4">{modalSubTitle}</div>
                                    }



                                    {/** Passing props to each form component */}
                                    {
                                        React.Children.map(children, child => {
                                                if (child) {
                                                    return React.cloneElement(child, {...submitForm, values, getValue, addValue, removeValue, setValue, getFormState, idGroup})
                                                }
                                            }
                                        )
                                    }

                                    {isFee && (
                                        <NummericInputForm
                                            field={'feeATM'}
                                            counterLabel={'Apollo'}
                                            type={'float'}
                                            label={'Fee'}
                                            setValue={setValue}
                                            placeholder={'Fee'}
                                            idGroup={idGroup}
                                            defaultValue={(modalData && modalData.feeATM) || '1'}
                                        />
                                    )}

                                    {/** Rendering of secret phrase and 2fa fields */}
                                    {
                                        !isDisableSecretPhrase &&
                                        // handleFormSubmit &&
                                        <ModalFooter
                                            off2FA={isDisabe2FA}
                                            setValue={setValue}
                                            getFormState={getFormState}
                                            values={values}
                                            idGroup={idGroup}
                                        />
                                    }

                                    {
                                        isAdvanced &&
                                        <AdvancedSettings
                                            setValue={setValue}
                                            getFormState={getFormState}
                                            values={values}
                                            white={isAdvancedWhite}
                                        />
                                    }

                                    {/** Bottom forms buttons */}
                                    {
                                        !CustomFooter &&
                                        !isDisableFormFooter &&
                                        submitButtonName &&
                                        <FormFooter
                                            submitButtonName={submitButtonName}
                                            isPending={isPending}
                                            setValue={setValue}
                                            closeModal={closeModal}
                                            idGroup={idGroup}
                                        />
                                    }
                                    {
                                        !!CustomFooter &&
                                        <CustomFooter/>
                                    }
                                </RightBar>
                            </div>
                        </form>
                    )}
                />
        )
    };

    render () {

        const {isPour, isXWide, isWide} = this.props;

        return (
            <>
                {
                    isPour ?
                    <>
                        { this.form() }
                    </>
                     :
                    <div className={`modal-box ${isWide ? 'wide' : ''} ${isXWide ? 'x-wide' : ''}`}>
                        { this.form() }
                    </div>
                }
            </>
        )
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    saveSendModalState: (params) => dispatch(saveSendModalState(params)),
	openPrevModal: () => dispatch(openPrevModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalBody);
