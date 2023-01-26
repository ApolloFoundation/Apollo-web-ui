/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getDataTagsAction} from "../../../../actions/datastorage";
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import submitForm from '../../../../helpers/forms/forms';
import {NotificationManager} from "react-notifications";


// Form components

import ModalBody from '../../../components/modals/modal-body';

import UpploadFileForm from './form';

class UploadFile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,
            dataTags: null,
            selectTags: [],

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    componentDidMount() {
        this.getDataTags();
    }

    getDataTags = async (reqParams) => {
        const allTaggedData = await this.props.getDataTagsAction(reqParams);
        if (allTaggedData) {
            this.setState({
                dataTags: allTaggedData.tags
            })
        }
    };

    handleChangeTags = (newValue, actionMeta) => {
        if(newValue.length > 3) {
            NotificationManager.error('You can add only 5 tags for the product', 'Error', 5000);
            return
        }
        if(newValue.length && (newValue[newValue.length - 1].label.length > 20)) {
            NotificationManager.error('Tag name must be no more than 20 symbols', 'Error', 5000);
            return
        }
        if(newValue.length && (newValue[newValue.length - 1].label.length < 3)) {
            NotificationManager.error('Tag name must be no less than 3 symbols', 'Error', 5000);
            return
        }
        this.setState({selectTags: newValue});
    };

    handleFormSubmit = async(values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            const tags = values.tags ? values.tags.map(({label}) => label).join(', ') : null;
            const res = await this.props.submitForm({...values, tags}, 'uploadTaggedData');
            if (res && res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('File has been submitted!', null, 5000);
            }
            this.setState({isPending: false});
        }
    };

    render() {
        const {dataTags, isPending, selectTags} = this.state;
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Upload file'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Upload file'}
                isPending={isPending}
            >
                {dataTags ? (
                    <UpploadFileForm
                        onChange={this.handleChangeTags}
                        value={selectTags}
                        dataTags={dataTags.map(tags => ({
                            value: tags.count,
                            label: tags.tag,
                        }))}
                    />
                ) : (
                    <div className={'align-items-center loader-box'}>
                        <div className="ball-pulse">
                            <div/>
                            <div/>
                            <div/>
                        </div>
                    </div>
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
    getDataTagsAction: (reqParams) => dispatch(getDataTagsAction(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
