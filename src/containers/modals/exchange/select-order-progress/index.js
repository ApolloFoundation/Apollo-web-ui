import React from 'react';
import {connect} from 'react-redux';
import ModalBody from '../../../components/modals/modal-body';
import TextualInputComponent from '../../../components/form-components/textual-input';

class SelectOrderProgress extends React.Component {

    isSender = () => {
        // this.props.modalData.accountId === this.props.contractStatus.sender
    }
    render() {
        const {contractStatus: {orderId, counterOrderId, sender, recipient, deadlineToReply}, modalData: {statusName}} = this.props;
        return (
            <ModalBody
                modalTitle={'Chosen trade'}
                closeModal={this.props.closeModal}
                isDisableSecretPhrase
                isDisableFormFooter
            >
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

const mapStateToProps = ({modals, exchange}) => ({
    modalData: modals.modalData,
    contractStatus: exchange.contractStatus,
});

export default connect(mapStateToProps, null)(SelectOrderProgress);