import React, {Component} from "react";
import config from "config";


export default class TargetDataUpload extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("hash") &&
	            <tr>
		            <td>Hash:</td>
		            <td>{this.props.transaction.attachment.hash}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("name") &&
	            <tr>
		            <td>Name:</td>
		            <td>{this.props.transaction.attachment.name}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("description") &&
	            <tr>
		            <td>Description:</td>
		            <td>{this.props.transaction.attachment.description}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("tags") &&
	            <tr>
		            <td>Tags:</td>
		            <td>{this.props.transaction.attachment.tags}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("type") &&
	            <tr>
		            <td>Mime Type:</td>
		            <td>{this.props.transaction.attachment.type}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("channel") &&
	            <tr>
		            <td>Channel:</td>
		            <td>{this.props.transaction.attachment.channel}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("isText") &&
	            <tr>
		            <td>Is Text:</td>
		            <td>{this.props.transaction.attachment.isText}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("filename") &&
	            <tr>
		            <td>Filename:</td>
		            <td>{this.props.transaction.attachment.filename}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("data") &&
	            <tr>
		            <td>Data Size:</td>
		            <td>{(this.props.transaction.attachment.data.length)/2}</td>
	            </tr>
	            }
	            {this.props.transaction.transaction &&
	            <tr>
		            <td>Link:</td>
		            <td>
			            <a
                            href={`${config.api.serverUrl}requestType=downloadTaggedData&transaction=${this.props.transaction.transaction}&retrieve=true`}
                            className={"btn btn-green"}
                            target={'_blank'}
                            download={this.props.transaction.attachment.filename}
                        >
                            Download
			            </a>
			            </td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}