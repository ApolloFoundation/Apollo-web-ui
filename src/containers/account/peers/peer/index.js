import React from 'react';
import {connect} from 'react-redux';

const mapDispatchToProps = dispatch => ({

})

const Peer = (props) => (
    <tr>
        <td className="blue-link-text">
            <a>
                {props.address}&nbsp;
            </a>
            {
                props.state == 1 &&
                <i className="zmdi zmdi-check-circle"></i>
            }
            {
                props.state == 2 &&
                <i className="zmdi zmdi-close-circle"></i>
            }
        </td>
        <td className="align-right">{props.weight}</td>
        <td className="align-right">{Math.round(props.downloadedVolume / 1000)} KB</td>
        <td className="align-right">{Math.round(props.uploadedVolume / 1000)} KB</td>
        <td className="align-right">{props.application} {props.version}</td>
        <td className="blue-link-text">{props.platform}</td>
        <td className="align-right">{props.services.map((el, index) => {if (index !== 0) {return ', ' + el} else {return el}})}</td>
        <td className="align-right"><a className="btn primary blue">Content</a><a
            className="btn primary">Blacklist</a>
        </td>
    </tr>
);

export default connect(null ,mapDispatchToProps)(Peer);
