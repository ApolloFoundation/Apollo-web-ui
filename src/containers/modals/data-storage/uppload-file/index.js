/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationManager } from "react-notifications";
import i18n from 'i18next';
import {getDataTagsAction} from "actions/datastorage";
import ModalBody from 'containers/components/modals/modal-body';
import { BallPulse } from 'containers/components/BallPulse';
import UpploadFileForm from './form';

const UploadFile = ({ closeModal, processForm }) => {
    const dispatch = useDispatch();
    const [dataTags, setDataTags] = useState(null);
    const [selectTags, setSelectTags] = useState([]);

    useEffect(() => {
        getDataTags();
    }, [getDataTags]);

    const getDataTags = useCallback(async () => {
        const allTaggedData = await dispatch(getDataTagsAction());
        if (allTaggedData) {
            const tags = allTaggedData.tags.map(tags => ({
                value: tags.count,
                label: tags.tag,
            }));
            setDataTags(tags);
        }
    }, [dispatch, setDataTags]);

    const handleChangeTags = useCallback((newValue) => {
        if (!newValue) return;
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
        setSelectTags(newValue);
    }, [setSelectTags]);

    const handleFormSubmit = useCallback(async(values) => {
        if (!values.file) {
            NotificationManager.error(i18n.t("error_no_file_chosen"), 'Error', 5000);
            return;
        }
        const tags = values.tags ? values.tags.map(({label}) => label).join(', ') : null;
        const res = await processForm({
                ...values, tags
            }, 
            'uploadTaggedData'
        );
        if (res && !res.errorCode) {
            closeModal();
            NotificationManager.success('File has been submitted!', null, 5000);
        }
    }, [closeModal, processForm]);

    return (
        <ModalBody
            modalTitle='Upload file'
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName='Upload file'
        >
            {dataTags ? (
                <UpploadFileForm
                    onChange={handleChangeTags}
                    value={selectTags}
                    dataTags={dataTags}
                />
            ) : (
                <div className={'align-items-center loader-box'}>
                    <BallPulse />
                </div>
            )}
        </ModalBody>
    );
}

export default UploadFile;
