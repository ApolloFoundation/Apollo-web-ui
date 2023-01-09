import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import FormFooter from '../form-components/form-footer';
import ModalFooter from '../modal-footer/index1';
import AdvancedSettings from '../advanced-transaction-settings';
import {openPrevModal, saveSendModalState} from "../../../modules/modals";
import BackForm from '../../modals/modal-form/modal-form-container';
import { FeeWrapper } from '../form-components/fee-wrapper';


class ModalBody extends React.Component {
    handleFormSubmit = (values) => {
        if (this.props.handleFormSubmit) {
            this.props.handleFormSubmit(values)
        }
    };
    // might be return on demand but need to create flow for using it
    // handleChange = (props) => {
    //     this.props.saveSendModalState(props.values);
    //     if (this.props.onChange) this.props.onChange(props);
    // };

    form = () => {
        const {
            CustomFooter, isDisableFormFooter, marketplace, isDisabledBackArrow, isAdvancedWhite,
            isDisableSecretPhrase, isDisabe2FA, modalSubTitle, className, idGroup, isPour, openPrevModal, modalsHistory,
            nameModel, children, handleFormSubmit, modalTitle, isPending, isDisabled, isFee, closeModal,
            submitButtonName, isClosingButton, initialValues, cancelButtonName,
        } = this.props;

        const RightBar = marketplace ? (p) => <div className="right-bar">{p.children}</div> : React.Fragment;
        const isAdvanced = false;

        return (
            <BackForm
                initialValues={initialValues}
                onSubmit={this.handleFormSubmit}
                nameModel={nameModel}
                className={classNames(className, { 'modal-form modal-send-apollo': isPour })}
            >
                        <div className='form-group-app'>
                            <RightBar>
                                {
                                    closeModal && !isPour &&
                                    <button type="button" onClick={closeModal} className="exit">
                                        <i className="zmdi zmdi-close"/>
                                    </button>
                                }

                                {
                                    modalTitle &&
                                    <div className="form-title">
                                        {
                                            !isDisabledBackArrow &&
                                            modalsHistory.length > 1 &&
                                            <div className="backMy" onClick={openPrevModal} />
                                        }
                                        <p>{modalTitle}</p>
                                    </div>
                                }

                                {modalSubTitle && (
                                    <div className="form-sub-title mb-4">{modalSubTitle}</div>
                                )}

                                {marketplace && (
                                    <>
                                        {marketplace.name && (
                                            <div className="form-title">
                                                {
                                                    !isDisabledBackArrow &&
                                                    modalsHistory.length > 1 &&
                                                    <div className="backMy" onClick={openPrevModal}/>
                                                }
                                                <p>{marketplace.name}</p>
                                            </div>
                                        )}
                                        <div className="form-group mb-15">
                                            <div className="top-bar">
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${marketplace.image})`
                                                    }}
                                                    className={classNames('marketplace-image', {
                                                        "no-image": !marketplace.hasImage
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group mb-15">
                                            <label>
                                                Price:
                                            </label>
                                            <div className="price">
                                                {marketplace.priceATM / this.props.decimals} {this.props.ticker}
                                            </div>
                                        </div>

                                        {marketplace.description && (
                                            <div className="form-group mb-15">
                                                <label>
                                                    Description:
                                                </label>
                                                <div>
                                                    {marketplace.description}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {children}
                                {isFee && (
                                    <FeeWrapper
                                        name='feeATM'
                                        idGroup={idGroup}
                                    />
                                )}
                                {/** Rendering of secret phrase and 2fa fields */}
                                {
                                    !isDisableSecretPhrase && handleFormSubmit &&
                                    <ModalFooter
                                        off2FA={isDisabe2FA}
                                        idGroup={idGroup}
                                    />
                                }

                                { isAdvanced && <AdvancedSettings white={isAdvancedWhite} /> }

                                {/** Bottom forms buttons */}
                                {
                                    !CustomFooter && !isDisableFormFooter &&
                                    <FormFooter
                                        submitButtonName={submitButtonName}
                                        isPending={isPending}
                                        isDisabled={isDisabled}
                                        closeModal={closeModal}
                                        isClosing={isClosingButton}
                                        idGroup={idGroup}
                                        cancelButtonName={cancelButtonName}
                                    />
                                }
                                { !!CustomFooter && <CustomFooter/> }
                            </RightBar>
                        </div>
            </BackForm>
        )
    };

    render() {

        const {isPour, isXWide, isWide} = this.props;

        return (
            isPour ?
                this.form()
                :
                <div className={
                    classNames('modal-box', { 
                        'wide': isWide,
                        'x-wide': isXWide,
                     })}
                >
                    {this.form()}
                </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    decimals: state.account.decimals,
    ticker: state.account.ticker,
});

const mapDispatchToProps = {
    saveSendModalState,
    openPrevModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalBody);
