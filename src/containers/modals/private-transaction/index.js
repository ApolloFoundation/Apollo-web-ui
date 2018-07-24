import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import curve25519 from '../../../helpers/crypto/curve25519'

class PrivateTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount() {
        console.log(curve25519);
    }

    handleFormSubmit(params) {
        const data = {
            passphrase: params.passphrase
        };

        this.props.setModalData(data);
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                   submitForm
                               }) => (
                    <form className="modal-form"  onSubmit={submitForm}>
                        <div className="form-group">
                            <div className="form-title">
                                <p>Show private transactions</p>
                            </div>
                            <div className="input-group">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label>Passphrase</label>
                                    </div>
                                    <div className="col-md-9">
                                        <Text field="passphrase" placeholder='Secret phrase' />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-right">Enter</button>
                        </div>
                    </form>
                )} />
                {/*<form className="modal-form" onSubmit={this.handleFormSubmit.bind(this)}>*/}
                    {/*<div className="form-group">*/}
                        {/*<div className="form-title">*/}
                            {/*<p>Show private transactions</p>*/}
                        {/*</div>*/}
                        {/*<div className="input-group">*/}
                            {/*<div className="row">*/}
                                {/*<div className="col-md-3">*/}
                                    {/*<label>Passphrase</label>*/}
                                {/*</div>*/}
                                {/*<div className="col-md-9">*/}
                                    {/*<input ref={'passphrase'} type="text" name={'passphrase'}/>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<button type="submit" className="btn btn-right">Enter</button>*/}
                    {/*</div>*/}
                {/*</form>*/}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data))
});

export default connect(null, mapDispatchToProps)(PrivateTransactions);
