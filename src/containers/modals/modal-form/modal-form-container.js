import React, {Component} from "react";
import {Form, Text} from 'react-form';
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

	loadValues = () => {
		if(this.props.modalsHistory.length > 0){
			const myModal = this.props.modalsHistory[this.props.modalsHistory.length -1];
			if(this.props.nameModal === myModal.modalName){
				this.state.form.setAllValues(myModal.value);
			}
		}
	};

    render() {
        return(
	        <Form
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
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BackForm);