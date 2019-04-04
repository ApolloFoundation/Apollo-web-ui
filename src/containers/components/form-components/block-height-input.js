import React, {Component} from 'react';
import {connect} from 'react-redux';
import classNames from "classnames";
import InputForm from '../../components/input-form';

class BlockHeightInput extends Component {

    componentDidMount = () => {
        const {setValue, actualBlock, field} = this.props;

        setValue(field, actualBlock)
    }
    
    render () {
        const {setValue, label, actualBlock, field, placeholder, deafultPlus, className, idGroup, isSubtitle} = this.props;
        
        return  (
            <div className={`form-group row form-group-white mb-15 ${className}`}>
                <label className="col-sm-3 col-form-label">
                    {label}
                </label>
                <div className={classNames({
                    "col-sm-9 input-group": true,
                    "input-group-text-transparent input-group-sm": isSubtitle
                })}>
                    <InputForm
                        type={"tel"}
                        field={field}
                        placeholder={placeholder}
                        defaultValue={actualBlock + (deafultPlus || 10000)}
                        setValue={setValue}
                        id={`${idGroup}${field}-field`}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text" id="finishHeightText">{!isSubtitle && actualBlock}</span>
                    </div>
                </div>
                {isSubtitle && (
                    <div className="offset-sm-3 col-sm-9 form-sub-title">
                        Current height: <b>{actualBlock}</b>
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    actualBlock: state.account.actualBlock,
})

export default connect(mapStateToProps)(BlockHeightInput);