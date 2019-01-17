import React from 'react';
import ModalBody from '../../../components/modals/modal-body';
import DescriptionTable from '../../../components/form-components/description-table';
import InfoBox from '../../../components/info-box'
import {connect} from 'react-redux';
import classNames from 'classnames';


import {setBodyModalParamsAction} from '../../../../modules/modals';
import {getAliasAction} from '../../../../actions/aliases/';
import { formatTimestamp } from '../../../../helpers/util/time';


class AliasInfo extends React.Component {

    state = {}

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.modalData && !this.state.alias) {
            this.setState({
                alias: nextProps.modalData
            })
        }
    }

    render () {

        const {alias} = this.state;
        const {formatTimestamp, setBodyModalParamsAction} = this.props;

        return (
            <ModalBody
                modalTitle={`Alias ${alias ? alias.aliasName : ''} Info`}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
            >
                <React.Fragment>
                    {
                        alias &&
                        <React.Fragment>
                            <DescriptionTable
                                items={[
                                    {
                                        title: 'Account: ',
                                        description: alias.accountRS
                                    },
                                    {
                                        title: 'Last Updated: ',
                                        description: alias.timestamp ? formatTimestamp(alias.timestamp) : ''
                                    },
                                    {
                                        title: 'Data: ',
                                        description: alias.aliasURI
                                    }
                                ]}
                            />
                            {
                                alias.priceATM && 
                                <InfoBox default>
                                    You have been offered this alias for { alias.priceATM / 100000000 } Apollo.&nbsp; 
                                    {
                                        this.state.alias &&
                                        <a
                                            onClick={() => setBodyModalParamsAction('BUY_ALIAS', this.state.alias)}
                                        >
                                            Buy it?
                                        </a>
                                    }
                                </InfoBox>
                            }
                        </React.Fragment>   
                    }
                </React.Fragment>
            </ModalBody>
        )
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AliasInfo);