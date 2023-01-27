/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import { getBlockchainStatusSelector } from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';

const mapStateToProps = state => ({
    blockchainStatus: getBlockchainStatusSelector(state),
});

const AboutApollo = ({ blockchainStatus, closeModal }) => (
    <ModalBody
        modalTitle='About Apollo'
        closeModal={closeModal}
        isDisableSecretPhrase
        isDisableFormFooter
        isWide
    >
        <div className="about">
            <div className="left-bar overflow-visible">
                <div className="about-image"/>
            </div>
            <div className="right-bar">
                <div className="description">
                    <p>Utilizing a team of world-class developers, managers, marketers, and researchers, the Apollo Foundation has set out to accomplish the vision of making Apollo the most technologically advanced, feature-rich, un-regulatable currency on Earth. We know the demands for a top-tier cryptocurrency, and we believe that we can create a coin that will integrate everything necessary to rise above the rest. As we develop and improve Apollo, our team will strive to continue designing and developing features that have not previously been used in cryptocurrency.</p>
                    <p>Our goal is to create the first all-in-one cryptocurrency, innovating and incorporating every ability that could be beneficial in currency, all in a single decentralized platform. Our first major update, Olympus Protocol, puts mass adoption-proof privacy at the core of Apollo. This is because we know the ability for a user to buy, sell, trade and send in absolute secrecy is vital to an industry that could be moments away from intense regulation. We are here because we believe that the only entity that should be in control of your funds is you.</p>
                    <p>
                        <ul>
                            <li><a target='blank' href='https://support.apollocurrency.com/support/home'><i className="zmdi zmdi-link" />&nbsp;Support</a></li>
                        </ul>
                    </p>
                    <p>
                        <a target='blank' href='https://t.me/apollocommunity' className={'h2 mr-5'} style={{color: '#0088cc'}}><i className="fab fa-telegram" /></a>
                        <a target='blank' href='https://www.facebook.com/Apolloprivacycoin' className={'h2 mr-5'} style={{color: '#3b5998'}}><i className="fab fa-facebook-f"/></a>
                        <a target='blank' href='https://twitter.com/aplfintech' className={'h2 mr-5'} style={{color: '#1da1f2'}}><i className="fab fa-twitter"/></a>
                        <a target='blank' href='https://www.instagram.com/apollocurrency/?hl=en' className={'h2 mr-5'} style={{color: '#c32aa3'}}><i className="fab fa-instagram"/></a>
                        <a target='blank' href='https://www.youtube.com/channel/UCZbB3PAUlkSKuBYEMG-l_CQ' className={'h2'} style={{color: '#ff0000'}}><i className="fab fa-youtube"/></a>
                    </p>
                    <p>Copyright © 2019 Apollo Developers.</p>
                    <p>Copyright © 2016-2017 Jelurida IP B.V.</p>
                    <p>Copyright © 2013-2016 The Nxt Core Developers.</p>
                    <p>Copyright Web Wallet © 2019 Apollo Developers</p>
                    <p>
                        Contact e-mail: <a href="mailto:info@apollocurrency.com">info@apollocurrency.com</a>
                    </p>
                    <p>
                        Actual Version: {blockchainStatus ? blockchainStatus.version : ''}
                    </p>
                </div>
            </div>
        </div>
    </ModalBody>
);

export default connect(mapStateToProps)(AboutApollo);
