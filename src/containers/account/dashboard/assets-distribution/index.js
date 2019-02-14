import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader'
import {getAccountAssetsAction, getSpecificAccountAssetsAction} from '../../../../actions/assets'
import CircleFigure from '../circle-figure';

class AssetsDistribution extends Component {
    state = {};

    componentDidMount = () => {
        this.getAssets();
    }

    getAssets = async (newState) => {
		let assets = await this.props.getAssetAction({
			account: this.props.account
		});
		if (assets) {
			const accountAssets = assets.accountAssets;
			const assetsInfo    = assets.assets;


			const result = accountAssets.map((el, index) => {
				return {...(assetsInfo[index]), ...el}
			});

            let assetsCountValue;

            if (!!result.length) {
                assetsCountValue = (result.map((el) => {return Number(el.quantityATU / Math.pow(10, el.decimals))})).reduce((a, b) => {return a + b});
			} else {
                assetsCountValue = 0;
            }
            
            console.log(result)

            this.setState({
				dashboardAssets: result.splice(0,3),
                assetsValue: assetsCountValue
			})
		}
    };

    render () {
        return (
            <div className="card asset-portfolio mb-3">
                <div className="card-title">Asset Portfolio</div>
                {
                    !this.state.dashboardAssets &&
                    <ContentLoader noPaddingOnTheSides onPaddingTop/>
                }
                <div className="full-box">
                    {
                        this.state.dashboardAssets &&
                        this.state.dashboardAssets.map((el, index) => {
                            if (index < 3) {
                                return (
                                    <div className="full-box-item coin">
                                        <div className="coin-data">
                                            <CircleFigure
                                                index={index}
                                                percentage={((parseInt(el.quantityATU) / parseInt(el.initialQuantityATU)) * 100).toFixed(2)}

                                                type={el.quantityATU}
                                            />
                                            <div
                                                className="amount"
                                            >
                                                {((parseInt(el.quantityATU) / parseInt(el.initialQuantityATU)) * 100).toFixed(2)} %
                                            </div>
                                            <div className="coin-name">{el.name}</div>
                                            <Link
                                                to={'/asset-exchange/' + el.asset}
                                                className="more"
                                            >
                                                <i className="zmdi zmdi-more"/>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }
                    {
                        !!this.state.dashboardAssets &&
                        this.state.dashboardAssets.length === 0 &&
                        <p>No assets found.</p>
                    }
                </div>
            </div>
							
        )
    }
}

const mapStateToProps = state => ({
	assets: state.account.assetBalances,
})

const mapDispatchToProps = dispatch => ({
	getAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(AssetsDistribution)