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

    componentDidMount = () => {
        this.getAliasAction('Itsme');
    }

    state = {
        alias: {
            accountRS: null,
            timestamp: null,
            aliasURI: null,
            price:  null
        }
    }

    getAliasAction = async (requestParams) => {
        const alias = await this.props.getAliasAction({aliasName: requestParams});

        if (alias) {
            this.setState({
                alias
            })
        }
    }

    render () {

        const {accountRS, aliasURI, timestamp, priceATM} = this.state.alias;
        const {formatTimestamp, setBodyModalParamsAction} = this.props;

        return (
            <ModalBody
                modalTitle={'Alias Info'}
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
            >

                <DescriptionTable
                    items={[
                        {
                            title: 'Account: ',
                            description: accountRS
                        },
                        {
                            title: 'Last Updated: ',
                            description: timestamp ? formatTimestamp(timestamp) : ''
                        },
                        {
                            title: 'Data: ',
                            description: aliasURI
                        }
                    ]}
                />

                <InfoBox default>
                    
                    You have been offered this alias for { priceATM / 100000000 } Apollo.&nbsp; 
                    {
                        this.state.alias &&
                        <a
                            onClick={() => setBodyModalParamsAction('BUY_ALIAS', this.state.alias)}
                        >
                            Buy it?
                        </a>
                    }
                </InfoBox>
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