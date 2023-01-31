import React, {Component} from "react";


const hashAlgorithm = {
	2: "2:SHA256",
	3: "3:SHA3",
	5: "5:SCRYPT",
	25: "25:Keccak25",
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
		            <td>{hashAlgorithm[this.props.transaction.attachment.algorithm] ?? '-'}</td>
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
