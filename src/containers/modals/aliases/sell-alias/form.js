import React from 'react';
import {connect} from 'react-redux';

import ModalBody from '../../../components/modals/modal-body';
import EditAliasForm from './form';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import TabContaier from '../../../components/tabulator/tab-container';
import {getAliasAction} from "../../../../actions/aliases";

import SellToAccountForm from './sell-to-account-form';
import SellToAllForm from './sell-to-anyone-form';

class SellAliasForm extends React.Component {

    state = {};

    componentDidMount = () => {
        this.getAlias();
    };

    getAlias = async () => {
        const alias = await this.props.getAliasAction({alias: this.props.modalData});

        if (alias) {
            this.setState({
                alias
            });
        }
    };

    render () {
        const {setValue, handleFormSubmit, closeModal} = this.props;

        return (
            <>
                <TabulationBody
                    className={'p-0'}
                >
            
                    <TabContaier sectionName={'Sell alias to Specific Account'}>
                        <ModalBody
                            closeModal={closeModal}
                            handleFormSubmit={(values) => handleFormSubmit(values)}
                            className={'p-0 transparent gray-form'}
                            isFee
                            isPour
                            submitButtonName={'Sell Alias'}
                        >
                            <SellToAccountForm 
                                setValue={setValue}
                                alias={this.state.alias}
                            />
                        </ModalBody>
                    </TabContaier>
            
                    <TabContaier sectionName={'Sell to Anyone'}>
                        <ModalBody
                            closeModal={closeModal}
                            handleFormSubmit={(values) => handleFormSubmit(values)}
                            className={'p-0 transparent gray-form'}
                            submitButtonName={'Sell alias'}
                            isFee
                            isPour
                        >
                            <SellToAllForm 
                                setValue={setValue}
                                alias={this.state.alias}
                            />
                        </ModalBody>
                    </TabContaier>
            
                </TabulationBody>
            </>
        )
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellAliasForm);