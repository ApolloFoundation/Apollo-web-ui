import React from 'react';
import InputForm from '../../components/input-form';
import {connect} from 'react-redux';
import {Text} from 'react-form';
import BlockHeightInput from '../../components/form-components/block-height-input';
import InfoBox from '../../components/info-box';

const mapStateToProps = state => ({
    is2fa: state.account.is2FA,
    accountControls: state.account.accountControls
});

class ModalFooter extends React.Component {
    render () {
        const {setValue, idGroup, accountControls} = this.props;

        return (
            <>
                <div 
                    className="form-group row form-group-white mb-15"
                    style={{marginBottom: 15}}
                >
                    <label className="col-sm-3 col-form-label">
                        Secret phrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                    </label>
                    <div className="col-sm-9">
                        <InputForm
                            isPlain
                            className={'form-control'}
                            type="password"
                            field="secretPhrase"
                            placeholder="Secret Phrase"
                            setValue={this.props.setValue}
                            id={`${this.props.idGroup}secretPhrase-field`} 
                        />
                    </div>
                </div>
                {
                    this.props.is2fa &&
                    !this.props.off2FA &&
                    <div className="form-group row form-group-white mb-15">
                        <label className="col-sm-3 col-form-label">
                            2FA code
                        </label>
                        <div className="col-sm-9">
                            <InputForm
                                className={'form-control'}
                                type="password"
                                field="code2FA"
                                placeholder="2FA code"
                                setValue={this.props.setValue}
                                id={`${this.props.idGroup}code2FA-field`} 
                            />
                        </div>
                    </div>
                }
                {
                    accountControls &&
                    <>
                        <InfoBox info>
                            Mandatory Approval account control is enabled. Please set Finish Height.
                            Account Control Details
                        </InfoBox>
                        <BlockHeightInput 
                            setValue={setValue}
                            label={'Finish Height'}
                            field={'phasingFinishHeight'}
                            placeholder={'Finish Height'}
                        />
                    </>
                }
            </>
        )
    }
}

export default connect(mapStateToProps)(ModalFooter)