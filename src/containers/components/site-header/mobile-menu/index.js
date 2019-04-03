import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import {setBodyModalParamsAction} from '../../../../modules/modals';

const getNavLinkClass = (path) => {
    return path.some(i => window.location.pathname === i) ? 'active' : '';
};


const MobileMenu = ({setBodyModalParamsAction, closeMenu}) => (
    <>
        <Accordion>
            <AccordionItem>
                <div className={`mobile-nav-item`}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass(["/dashboard",
                            "/ledger",
                            "/account-properties",
                            "/transactions",
                            "/approval-request"])
                            }`}>
                        <i className="zmdi zmdi-view-dashboard"/>
                        Dashboard
                        <span className="arrow"/>
                    </AccordionItemTitle>

                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink exact={true} activeClassName="active"
                                        to="/dashboard">Dashboard</NavLink>
                            <NavLink exact={true} activeClassName="active" to="/ledger">Account
                                ledger</NavLink>
                            <NavLink exact={true} activeClassName="active"
                                        to="/account-properties">Account
                                properties</NavLink>
                            <NavLink exact={true} activeClassName="active"
                                        to="/transactions">My
                                transactions</NavLink>
                            <NavLink exact={true} activeClassName="active"
                                        to="/approval-request">Approval
                                requests</NavLink>
                        </div>
                    </AccordionItemBody>
                </div>
            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass(["/exchange", "/choose-wallet"])}`}>
                        <i className="zmdi zmdi-trending-up"/>Exchange
                        <span className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink to="/exchange">Exchange</NavLink>
                            <NavLink to="/choose-wallet">Wallets</NavLink>
                        </div>
                    </AccordionItemBody>
                </div>
            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass(["/trade-history",
                            "/transfer-history",
                            "/delete-history",
                            "/asset-exchange",
                            "/my-assets",
                            "/open-orders",
                            "approval-request"])}`}>
                        <i className="zmdi zmdi-case"/>Asset system<span
                        className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink exact={true} activeClassName="active" to="/all-assets">
                                All assets
                            </NavLink>
                            <NavLink exact={true} activeClassName="active" to="/asset-exchange">
                                Asset exchange
                            </NavLink>
                            <NavLink exact={true} activeClassName="active"
                                        to="/trade-history">Trade history</NavLink>
                            <NavLink exact={true} activeClassName="active"
                                        to="/transfer-history">Transfer history</NavLink>
                            <NavLink exact={true} activeClassName="active"
                                        to="/delete-history">Delete history</NavLink>
                            <NavLink exact={true} activeClassName="active" to="/my-assets">My
                                assets</NavLink>
                            <NavLink exact={true} activeClassName="active"
                                        to="/open-orders">Open orders</NavLink>
                            {/* <NavLink exact={true} activeClassName="active"
                                        to="approval-request">Approval request</NavLink> */}

                            <a 
                                id='open-issue-asset-mobile'
                                onClick={() => setBodyModalParamsAction('ISSUE_ASSET')}
                            >
                                Issue assets
                            </a>
                        </div>
                    </AccordionItemBody>
                </div>

            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass([
                            "/currencies",
                            "/my-currencies",
                            "/transfer-history-currency",
                            "/exchange-history-currency"])}`}>
                        <i className="zmdi zmdi-money"/>Currency system<span
                        className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink to="/currencies">Currencies</NavLink>
                            <NavLink to="/my-currencies">My Currencies</NavLink>
                            <NavLink to="/exchange-history-currency">Exchange history</NavLink>
                            <NavLink to="/transfer-history-currency">Transfer history</NavLink>
                            <a 
                                id='open-issue-currency-mobile'
                                onClick={() => setBodyModalParamsAction('ISSUE_CURRENCIES')}
                            >
                                Issue Currencies
                            </a>
                        </div>
                    </AccordionItemBody>
                </div>

            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass(["/active-polls",
                            "/followed-polls",
                            "/my-votes",
                            "/my-polls"])}`}>
                        <i className="zmdi zmdi-star"/>Voting system
                        <span className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink to="/active-polls">Active polls</NavLink>
                            <NavLink to="/followed-polls">Followed polls</NavLink>
                            <NavLink to="/my-votes">My votes</NavLink>
                            <NavLink to="/my-polls">My polls</NavLink>

                            <a 
                                id='open-create-poll-mobile'
                                onClick={() => setBodyModalParamsAction('ISSUE_POLL')}
                            >
                                Create poll
                            </a>
                        </div>
                    </AccordionItemBody>
                </div>

            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass(["/data-storage"])}`}>
                        <i className="zmdi zmdi-dns"/>Data storage<span className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink to="/data-storage">Search</NavLink>

                            <a 
                                id='open-file-upload-mobile'
                                onClick={() => setBodyModalParamsAction('ISSUE_FILE_UPLOAD')}
                            >
                                File upload
                            </a>
                        </div>
                    </AccordionItemBody>
                </div>

            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass(["/my-products-for-sale",
                            "/my-pending-orders",
                            "/recent-listing",
                            "/my-completed-orders"])}`}>
                        <i className="zmdi zmdi-label"/>Marketplace<span className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            {window.innerHeight < 768 && <NavLink to="/marketplace">Marketplace</NavLink>}

                            <NavLink to="/purchased-products">Purchased Products</NavLink>
                            <NavLink to="/my-products-for-sale">My products for sale</NavLink>
                            <NavLink to="/my-pending-orders">My pending orders</NavLink>
                            <NavLink to="/my-completed-orders">My completed orders</NavLink>
                            <a
                                id='open-list-product-for-sale-mobile'
                                onClick={() => setBodyModalParamsAction('LIST_PRODUCT_FOR_SALE')}
                            >
                                List product for sale
                            </a>
                        </div>
                    </AccordionItemBody>
                </div>

            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass([
                            "/active-shuffling",
                            "/finished-shuffling",
                            "/my-shuffling"])}`}>
                        <i className="zmdi zmdi-circle-o"/>Coin shuffling
                        <span className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink to="/active-shuffling">Active shuffling</NavLink>
                            <NavLink to="/finished-shuffling">Finished shuffling</NavLink>
                            <NavLink to="/my-shuffling">My shuffling</NavLink>
                            <a 
                                id='open-create-shuffling-mobile'
                                onClick={() => setBodyModalParamsAction('ISSUE_CREATE_SHUFFLING')}
                            >
                                Create shuffling
                            </a>
                        </div>
                    </AccordionItemBody>
                </div>

            </AccordionItem>
            <AccordionItem>
                <div className={"mobile-nav-item"}>
                    <AccordionItemTitle
                        className={`text ${getNavLinkClass(["/messenger", "/my-messages"])}`}>
                        <i className="zmdi zmdi-comments"/>Messages<span className="arrow"/>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <div className="item-dropdown">
                            <NavLink exact={true} activeClassName="active" to="/my-messages">My messages</NavLink>
                            <NavLink exact={true} activeClassName="active" to="/messenger">Chat</NavLink>
                        </div>
                    </AccordionItemBody>
                </div>

            </AccordionItem>
        </Accordion>

        <NavLink exact={true} activeClassName="active" to="/aliases"
                    className={"mobile-nav-item"}>
            <p className="text">Aliases <i className="zmdi zmdi-accounts"/></p>
        </NavLink>
        <div className="btn-block text-center">
            <div className="close-menu-btn" onClick={closeMenu}>
                Close
            </div>
        </div>
    </>
)

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value))
})

export default connect(null, mapDispatchToProps)(MobileMenu);