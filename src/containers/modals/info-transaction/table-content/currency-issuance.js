import React, {Component} from "react";


function hashAlgorithm (value) {
	if(value === 2){
		return "2:SHA256";
	} else if (value === 3) {
		return "3:SHA3";
	} else if (value === 5) {
		return "5:SCRYPT";
	} else if (value === 25) {
		return "25:Keccak25";
	} else {
		return "-"
	}
}


export default class CurrencyIssuance extends Component {
    render() {
        return(
            <React.Fragment>
	            {this.props.transaction.attachment.hasOwnProperty("name") &&
	            <tr>
		            <td>Name:</td>
		            <td>{this.props.transaction.attachment.name}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("code") &&
	            <tr>
		            <td>Code:</td>
		            <td>{this.props.transaction.attachment.code}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("description") &&
	            <tr>
		            <td>Description:</td>
		            <td>{this.props.transaction.attachment.description}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("initialSupply") &&
	            <tr>
		            <td>Initial Units Supply:</td>
		            <td>{this.props.transaction.attachment.initialSupply}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("reserveSupply") &&
	            <tr>
		            <td>Reserve Supply:</td>
		            <td>{this.props.transaction.attachment.reserveSupply}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("maxSupply") &&
	            <tr>
		            <td>Maximum Units Supply:</td>
		            <td>{this.props.transaction.attachment.maxSupply}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("decimals") &&
	            <tr>
		            <td>Decimals:</td>
		            <td>{this.props.transaction.attachment.decimals}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("issuanceHeight") &&
	            <tr>
		            <td>Activation Height:</td>
		            <td>{this.props.transaction.attachment.issuanceHeight}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("minReservePerUnitATM") &&
	            <tr>
		            <td>Minimum Reserve Per Unit:</td>
		            <td>{this.props.transaction.attachment.minReservePerUnitATM / this.props.decimals} {this.props.ticker}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("minDifficulty") &&
	            <tr>
		            <td>Minimum Difficulty:</td>
		            <td>{this.props.transaction.attachment.minDifficulty}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("maxDifficulty") &&
	            <tr>
		            <td>Maximum Difficulty:</td>
		            <td>{this.props.transaction.attachment.maxDifficulty}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("algorithm") &&
	            <tr>
		            <td>Algorithm:</td>
		            <td>{hashAlgorithm(this.props.transaction.attachment.algorithm)}</td>
	            </tr>
	            }
	            {this.props.transaction.attachment.hasOwnProperty("initialSupply") &&
	            <tr>
		            <td>Current Units Supply:</td>
		            <td>{this.props.transaction.attachment.initialSupply}</td>
	            </tr>
	            }
	            {/*{this.props.transaction.attachment.hasOwnProperty("ruleset") &&*/}
	            {/*<tr>*/}
	            {/*<td>Current Reserve Per Unit:</td>*/}
	            {/*<td>{this.props.transaction.attachment.ruleset} Apollo</td>*/}
	            {/*</tr>*/}
	            {/*}*/}
            </React.Fragment>
        );
    }
}
