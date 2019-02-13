/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData}             from '../../../modules/modals';
import {setBodyModalParamsAction} from "../../../modules/modals";
import classNames from 'classnames';

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    blockchainStatus: state.account.blockchainStatus,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class AboutApollo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goods: null
        };
    }

    render() {
        const {blockchainStatus} = this.props;

        return (
            <div className="modal-box wide">
                <div className="modal-form">
                    <div className="form-group-app devided about">
                        <div className="left-bar overflow-visible">
                            <div className="top-bar">
                                <div className="form-title">
                                    <p>About Apollo</p>
                                </div>
                                <div
                                    className={classNames({
                                        "about-image": true,
                                    })}
                                />
                            </div>
                        </div>
                        <div className="right-bar">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
                            <div className="description">
                                Utilizing a team of world-class developers, managers, marketers, and researchers, the Apollo Foundation has set out to accomplish the vision of making Apollo the most technologically advanced, feature-rich, un-regulatable currency on Earth. We know the demands of a top-tier cryptocurrency, and we believe we can create a coin that will integrate everything necessary to rise above the rest. As we develop and improve Apollo, our team will strive to continue designing and developing features that have not previously been used in cryptocurrency. Our goal is to create the first all-in-one cryptocurrency, innovating and incorporating every ability that could be beneficial in currency, all in a single decentralized platform. Our first major update, Olympus Protocol, puts mass adoption-proof privacy at the core of Apollo. This is because we know the ability for a user to buy, sell, trade and send in absolute secrecy is vital to an industry that could be moments away from intense regulation. We are here because we believe that the only entity that should be in control of your funds is you.

                                <p>
                                    <ul>
                                        <li><a target='blank' href='https://support.apollocurrency.com/support/home'><i class="zmdi zmdi-link" />&nbsp;Support</a></li>
                                    </ul>
                                </p>
                                
                                <p>
                                    <a target='blank' href='https://t.me/apollocommunity' className={'h2'} style={{color: '#0088cc'}}><i class="fab fa-telegram" /></a>      &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a target='blank' href='https://www.facebook.com/Apolloprivacycoin' className={'h2'} style={{color: '#3b5998'}}><i class="fab fa-facebook-f"></i></a>  &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a target='blank' href='https://twitter.com/ApolloCurrency' className={'h2'} style={{color: '#1da1f2'}}><i class="fab fa-twitter"></i></a>     &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a target='blank' href='https://www.instagram.com/apollocurrency/?hl=en' className={'h2'} style={{color: '#c32aa3'}}><i class="fab fa-instagram"></i></a>   &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a target='blank' href='https://www.youtube.com/channel/UCZbB3PAUlkSKuBYEMG-l_CQ' className={'h2'} style={{color: '#ff0000'}}><i class="fab fa-youtube"></i></a>     &nbsp;&nbsp;&nbsp;&nbsp;
                                </p>

                                <p>Copyright © 2019 Apollo Developers.</p>
                                <p>Copyright © 2016-2017 Jelurida IP B.V.</p>
                                <p>Copyright © 2013-2016 The Nxt Core Developers.</p>
                                <p>Copyright Web Wallet © 2019 Apollo Developers</p>

                                <p>
                                    Contact e-mail: <a href="">info@apollocurrency.com</a>
                                </p>
                                {console.log(blockchainStatus)}
                                <p>
                                    Actual Version: {blockchainStatus ? blockchainStatus.version : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutApollo);
