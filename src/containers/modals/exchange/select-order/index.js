import React from 'react';
import {connect} from 'react-redux';
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';
// TODO update
class SelectOrder extends React.Component {
    render() {
        return (
            <ModalBody
                modalTitle={'Chosen trade'}
                closeModal={this.props.closeModal}
                isDisableSecretPhrase
                isDisableFormFooter
            >
                <TextualInputComponent
                    field={'typeName'}
                    disabled
                    label={'Type'}
                    placeholder={'Type'}
                />
                <TextualInputComponent
                    field={'pairRate'}
                    disabled
                    label={'Price'}
                    placeholder={'Price'}
                />
                <TextualInputComponent
                    field={'offerAmount'}
                    disabled
                    label={'Amount'}
                    placeholder={'Amount'}
                />
                <TextualInputComponent
                    field={'total'}
                    disabled
                    label={'Total'}
                    placeholder={'Total'}
                />
                <TextualInputComponent
                    field={'statusName'}
                    disabled
                    label={'Status'}
                    placeholder={'Status'}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

export default connect(mapStateToProps, null)(SelectOrder);
