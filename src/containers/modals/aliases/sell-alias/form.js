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
        const {setValue, handleSellAlias, closeModal, alias, onFocus} = this.props;

        return (
            <>
                <TabulationBody
                    className={'p-0'}
                    onFocus={(i) => onFocus(i)}
                >
                    <TabContaier 
                        sectionName={'Sell alias to Specific Account'}
                    >
                        <ModalBody
                            onChange={values => handleSellAlias(values, 'sellToSpeciffic')}
                            closeModal={closeModal}
                            className={'p-0 transparent gray-form'}
                            submitButtonName={'Sell Alias'}
                            isDisableFormFooter
                            isFee
                            isPour
                            idGroup={'sell-alias-account-modal-'}
                        >
                            <SellToAccountForm 
                                setValue={setValue}
                                alias={alias}
                            />
                        </ModalBody>
                    </TabContaier>
            
                    <TabContaier 
                        sectionName={'Sell to Anyone'}
                    >
                        <ModalBody
                            onChange={values => handleSellAlias(values, 'sellToAll')}
                            closeModal={closeModal}
                            className={'p-0 transparent gray-form'}
                            submitButtonName={'Sell alias'}
                            isDisableFormFooter
                            isFee
                            isPour
                            idGroup={'sell-alias-anyone-modal-'}
                        >
                            <SellToAllForm 
                                setValue={setValue}
                                alias={alias}
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