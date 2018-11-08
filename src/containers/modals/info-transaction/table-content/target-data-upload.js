import React, {Component} from "react";


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
	            {this.props.transaction.attachment.hasOwnProperty("tags") &&
	            <tr>
		            <td>Data Size:</td>
		            <td>{this.props.transaction.attachment.tags}</td>
	            </tr>
	            }
	            {this.props.transaction.transaction &&
	            <tr>
		            <td>Link:</td>
		            <td>
			            {this.props.transaction.transaction}</td>
	            </tr>
	            }
            </React.Fragment>
        );
    }
}