import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import FormFooter from '../form-components/FormButtons';
import ModalFooter from '../modal-footer';
import {openPrevModal, saveSendModalState} from "../../../modules/modals";
import BackForm from '../../modals/modal-form/modal-form-container';
import { FeeWrapper } from '../form-components/FeeWrapper';
import { getModalDataSelector, getModalHistorySelector, getModalTypeSelector } from '../../../selectors';
import { ModalBodyMarketplace } from './ModalBodyMarketplace'


const ModalBody = (props) => {
    // might be return on demand but need to create flow for using it
    // handleChange = (props) => {
    //     this.props.saveSendModalState(props.values);
    //     if (this.props.onChange) this.props.onChange(props);
    // };

    const form = () => {
        const {
            CustomFooter, isDisableFormFooter, marketplace, isDisabledBackArrow, isAdvancedWhite,
            isDisableSecretPhrase, isDisabe2FA, modalSubTitle, className, idGroup, isPour, openPrevModal, modalsHistory,
            nameModel, children, handleFormSubmit, modalTitle, isPending, isDisabled, isFee, closeModal,
            submitButtonName, isClosingButton, initialValues, cancelButtonName, isLoadValue, enableReinitialize,
        } = props;

        const RightBar = marketplace ? (p) => <div className="right-bar">{p.children}</div> : React.Fragment;

        return (
            <BackForm
                initialValues={{
                    ...initialValues,
                    feeATM: 1,
                }}
                onSubmit={props.handleFormSubmit}
                nameModel={nameModel}
                className={classNames(className, { 'modal-form modal-send-apollo': !isPour })}
                isLoadValue={isLoadValue}
                enableReinitialize={enableReinitialize}
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
                            modalTitle && (
                            <div className="form-title">
                                {
                                    !isDisabledBackArrow &&
                                    modalsHistory.length > 1 &&
                                    <div className="backMy" onClick={openPrevModal} />
                                }
                                <p>{modalTitle}</p>
                            </div>
                        )}
                        {modalSubTitle && <div className="form-sub-title mb-4">{modalSubTitle}</div>}

                        <ModalBodyMarketplace
                            marketplace={marketplace}
                            openPrevModal={openPrevModal}
                            isDisabledBackArrow={isDisabledBackArrow}
                            modalsHistory={modalsHistory}
                        />

                        {children}
                        {isFee && <FeeWrapper name='feeATM' idGroup={idGroup} /> }
                        {/** Rendering of secret phrase and 2fa fields */}
                        {
                            !isDisableSecretPhrase && handleFormSubmit &&
                            <ModalFooter
                                off2FA={isDisabe2FA}
                                idGroup={idGroup}
                            />
                        }
                        {/** Bottom forms buttons */}
                        { !CustomFooter && !isDisableFormFooter &&
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

    return (
        props.isPour ?
            form()
            :
            <div className={
                classNames('modal-box', { 
                    'wide': props.isWide,
                    'x-wide': props.isXWide,
                    "active": props.modalType,
                    })}
            >
                {form()}
            </div>
    );
}

const mapStateToProps = state => ({
    modalData: getModalDataSelector(state),
    modalsHistory: getModalHistorySelector(state),
    modalType: getModalTypeSelector(state),
});

const mapDispatchToProps = {
    saveSendModalState,
    openPrevModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalBody);
