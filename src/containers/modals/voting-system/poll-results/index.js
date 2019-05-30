import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    getpollAction,
    getPollResultAction,
    getPollVotesAction
} from '../../../../actions/polls';

import VoteResultItem from '../../../account/followed-polls/vote-result/';
import PollRequestItem from  '../../../account/followed-polls/poll-request/';
import ModalBody from '../../../components/modals/modal-body';
import TabContaier from '../../../components/tabulator/tab-container';
import TabulationBody from '../../../components/tabulator/tabuator-body';
import CustomTable from '../../../components/tables/table';

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
    account: state.account.account,
    modalData: state.modals.modalData

})

const mapDispatchToProps = dispatch => ({
    getpollAction       : (reqParams) => dispatch(getpollAction(reqParams)),
    getPollResultAction : (reqParams) => dispatch(getPollResultAction(reqParams)),
    getPollVotesAction  : (reqParams) => dispatch(getPollVotesAction(reqParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PollResults);
