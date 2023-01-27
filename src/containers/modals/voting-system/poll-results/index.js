import React, {Component} from 'react';
import {connect} from 'react-redux';
import { getPollResultAction, getPollVotesAction } from 'actions/polls';
import VoteResultItem from 'containers/account/followed-polls/vote-result/';
import PollRequestItem from  'containers/account/followed-polls/poll-request/';
import ModalBody from 'containers/components/modals/modal-body';
import TabContaier from 'containers/components/tabulator/tab-container';
import TabulationBody from 'containers/components/tabulator/tabuator-body';
import CustomTable from 'containers/components/tables/table';
import { getAccountSelector, getModalDataSelector } from 'selectors';

class PollResults extends Component {

    state = {};

    componentDidMount = () => {
        this.getPoll()
    }

    getPoll = () => {
        const {account, getPollResultAction, getPollVotesAction} = this.props;
        const poll = this.props.modalData

        const pollVotes   = getPollVotesAction({
            poll
        });
        const pollResults = getPollResultAction({
            poll
        });

        Promise.all([pollResults, pollVotes])
            .then((data) => {
                const [pollResults, pollVotes] = data;

                this.setState({
                    pollResults,
                    pollVotes
                })
            })


    }

    render () {
        const {nameModal} = this.props;
        const {pollResults, pollVotes} = this.state;
        const options = pollResults && pollResults.options ? pollResults.options.map(el => {
            return {
                name: el,
                alignRight: true
            }
        }) : []

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Poll Results'}
                closeModal={this.props.closeModal}
                nameModel={nameModal}
                idGroup={'poll-results-modal-'}
                isDisableSecretPhrase
                isPoru
            >
                <TabulationBody
                    className={'gray-form'}
                >
                    <TabContaier sectionName={'Poll Results'}>
                    <CustomTable
                        header={[
                            {
                                name: 'Voter',
                                alignRight: false
                            },{
                                name: 'Result',
                                alignRight: true
                            },{
                                name: 'Weight Supply',
                                alignRight: true
                            }
                        ]}
                        TableRowComponent={PollRequestItem}
                        tableData={this.state.pollResults && this.state.pollResults.results ? this.state.pollResults.results.map((el, index) => ({...el, option: this.state.pollResults.options[index]})) : null}
                        className={'no-min-height transparent'}
                        emptyMessage={'No poll request.'}
                    />
                    </TabContaier>

                    <TabContaier sectionName={'Votes Cast'}>
                        <CustomTable
                            header={[
                                {
                                    name: 'Voter',
                                    alignRight: false
                                },
                                ...options
                            ]}
                            className={'no-min-height transparent'}
                            TableRowComponent={VoteResultItem}
                            tableData={pollVotes ? pollVotes.votes : null}
                            emptyMessage={'No poll request.'}
                        />
                    </TabContaier>
                </TabulationBody>
            </ModalBody>
        )
    }
}

const mapStateToProps = state => ({
    account: getAccountSelector(state),
    modalData: getModalDataSelector(state)
})

const mapDispatchToProps = {
    getPollResultAction,
    getPollVotesAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PollResults);
