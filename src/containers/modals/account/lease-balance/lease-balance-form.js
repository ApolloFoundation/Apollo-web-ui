import React from 'react';
import {connect} from 'react-redux';

import NumericInputComponent from '../../../components/form-components/numeric-input';
import AccountRSInput        from '../../../components/form-components/account-rs';


const LeaseBalanceForm = ({setValue, blockGenerationTime, values}) => {

    const period  = parseInt(values && values.period ? values.period : 0);
    const avgTime = period ? Math.round((period * (blockGenerationTime ? blockGenerationTime : 10)) / 86400) : 0;

    return (
        <>
            <AccountRSInput
                label={'Recipient'}
                field={'recipient'}
                placeholder={'Recipient'}
                setValue={setValue}
                defaultValue={values.recipient ?? ''}
                value={values.recipient}
            />
            <NumericInputComponent
                label={'Period'}
                field={'period'}
                placeholder={'Period'}
                setValue={setValue}
                defaultVallue={0}
                inputHint={`A lease of ${period} blocks is about ${avgTime} days.`}
            />
        </>
    )
}

const mapStateToProps = state => {

    const blockchainStatus = state.account.blockchainStatus;
    
    return {
        blockGenerationTime: blockchainStatus ? blockchainStatus.emptyBlockTime : null
    }
}

export default connect(mapStateToProps)(LeaseBalanceForm)