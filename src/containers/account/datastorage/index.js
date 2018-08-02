import React from 'react';
import {connect} from 'react-redux';
import {getAllTaggedDataAction, getDataTagsAction} from "../../../actions/datastorage";


const mapDispatchToProps = dispatch => ({
    getAllTaggedDataAction: (reqParams) => dispatch(getAllTaggedDataAction(reqParams)),
    getDataTagsAction: (reqParams) => dispatch(getDataTagsAction(reqParams))
});

@connect(null, mapDispatchToProps)
class DataStorage extends React.Component {
    constructor(props) {
        super(props);
    }

    getAllTaggedData = async () => {
        const allTaggedData = this.props.getDataTagsAction;

        if (allTaggedData) {
            console.log(allTaggedData);
        }
    };


    render () {
        return (
            <div></div>
        );
    }
}

export default DataStorage;