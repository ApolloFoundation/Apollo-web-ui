import React from 'react';
import InputForm from '../../components/input-form';
import {getAssetAction} from "../../../actions/assets";
import {connect} from 'react-redux';

class AssetInput extends React.Component {

    state = {}

    getAsset =  async (values) => {
        const asset = await this.props.getAssetAction(values);

        if (asset) {
            this.setState({
                asset
            })
        } else {
            this.setState({
                asset: null
            })
        }
    }

    render () {

        const {field, setValue} = this.props;

        return (
            <div className="form-group row form-group-grey mb-15">
                <label className="col-sm-3 col-form-label">
                    Asset ID
                </label>
                <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                    <InputForm
                        field={field}
                        placeholder="Asset"
                        onChange={(asset) => this.getAsset({asset})}
                        setValue={setValue}/>
                    <div className="input-group-append">
                        <span className="input-group-text">Asset: {this.state.asset ? this.state.asset.name : '-'}</span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams))

})

export default connect(null , mapDispatchToProps)(AssetInput);