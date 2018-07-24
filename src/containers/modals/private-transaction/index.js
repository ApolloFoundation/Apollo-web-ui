import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';

class PrivateTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const data = {
            passphrase: this.refs.passphrase.value
        };

        this.props.setModalData(data, this.props.modalCallback);
        console.log(data);
    }

    render() {
        return (
            <div className="modal-box">
                <form className="modal-form" onSubmit={this.handleFormSubmit.bind(this)}>
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
                                    <input ref={'passphrase'} type="text" name={'passphrase'}/>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-right">Enter</button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalCallback: state.modals.modalCallback
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data, callback) => dispatch(setModalData(data, callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateTransactions);
