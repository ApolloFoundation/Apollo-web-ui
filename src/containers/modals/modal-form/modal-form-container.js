import React, {Component} from "react";
import {Form} from 'react-form';
import {connect} from "react-redux";

class BackForm extends Component {
	state = {
		form: null,
	};

	getForm = (form) => {
		this.setState({form}, () => this.loadValues());
		if(this.props.getApi){
			this.props.getApi(form);
		}

	};

	componentWillReceiveProps = ({modalData}) => {

		// If new props has been received and form parameters have not already replaced
		if (modalData && Object.keys(modalData).length > 0 && !this.state.modalData) {
			this.setState({
				modalData
			}, () => this.loadValues(modalData))
		}
	}

	loadValues = (values) => {
		if (values) {
			this.state.form.setAllValues(values);
			return;
		}

		if(this.props.modalsHistory.length > 0){
			const myModal = this.props.modalsHistory[this.props.modalsHistory.length -1];
			if(this.props.nameModal === myModal.modalName && myModal.value){
				this.state.form.setAllValues(myModal.value);
			}
		}
	};

    render() {
        return(
	        <Form
				    onChange={this.props.onChange}
		        nameModal={this.props.nameModal}
		        onSubmit={(values) => this.props.onSubmit(values)}
		        getApi={(value) => this.getForm(value)}
		        render={(formApi) => this.props.render(formApi)}
	        >
		        {this.props.children}
	        </Form>
        );
    }
}

const mapStateToProps = state => ({
	savedValues: state.modals.savedValues,
	modalsHistory: state.modals.modalsHistory,

	modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BackForm);
