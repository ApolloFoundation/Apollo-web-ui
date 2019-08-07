/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {
    getDataTagsAction,
} from "../../../../actions/datastorage";
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import InputForm from '../../../components/input-form';
import InfoBox from '../../../components/info-box';
import {Form, Text, TextArea} from 'react-form';

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
            dataTags: '',

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

    handleFormSubmit = async(values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});

            const res = await this.props.submitForm(values, 'uploadTaggedData');
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
        const {dataTags} = this.state;
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Upload file'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Upload file'}
                isPending={this.state.isPending}
            >

                {dataTags.length && <UpploadFileForm
                    dataTags={this.state.dataTags.map(tags => ({
                        value: tags.count,
                        label: tags.tag,
                    }))}
                />}

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
