import React, {useState, useEffect} from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import {NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import smcAddress from '../../../../smc.json';

const getNavLinkClass = (path) => {
    return path.some(i => window.location.pathname === i) ? 'active' : '';
};

const MobileMenu = ({closeMenu}) => {
    const dispatch = useDispatch()
    const chainId = useSelector(state => state.account.blockchainStatus.chainId)
    const [smartContractAddress, setSmartContractAddress] = useState('#')
    
    useEffect(()=>{
        if(chainId){
            const chainIdValue = chainId.split('-');
			setSmartContractAddress(smcAddress[chainIdValue[0]]);
        }
    },[chainId])

    return (
        <>
            <Accordion>
                <AccordionItem>
                    <div className={`mobile-nav-item`}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass(["/dashboard",
                                "/ledger",
                                "/account-properties",
                                "/transactions",
                                "/approval-request"])
                            }`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-view-dashboard"/>
                                Dashboard
                                <span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>

                        <AccordionItemPanel>
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
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass(["/dex", "/choose-wallet", "/order-history"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-trending-up"/>Exchange
                                <span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink to="/dex">Dashboard</NavLink>
                                <NavLink to="/choose-wallet">Wallets</NavLink>
                                <NavLink to="/order-history">Order History</NavLink>
                                <NavLink to="/trade-history-exchange">Trade History</NavLink>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass(["/trade-history",
                                "/transfer-history",
                                "/delete-history",
                                "/asset-exchange",
                                "/my-assets",
                                "/open-orders",
                                "approval-request"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-case"/>Asset system<span
                                className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink exact={true} activeClassName="active" to="/all-assets">
                                    All assets
                                </NavLink>
                                <NavLink exact={true} activeClassName="active" to="/my-assets">
                                    My assets
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
                                <NavLink exact={true} activeClassName="active"
                                        to="/open-orders">Open orders</NavLink>
                                {/* <NavLink exact={true} activeClassName="active"
                                            to="approval-request">Approval request</NavLink> */}

                                <a
                                    id='open-issue-asset-mobile'
                                    onClick={() => dispatch(setBodyModalParamsAction('ISSUE_ASSET'))}
                                >
                                    Issue assets
                                </a>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass([
                                "/currencies",
                                "/my-currencies",
                                "/transfer-history-currency",
                                "/exchange-history-currency"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-money"/>Currency system<span
                                className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink to="/currencies">Currencies</NavLink>
                                <NavLink to="/my-currencies">My Currencies</NavLink>
                                <NavLink to="/exchange-history-currency">Exchange history</NavLink>
                                <NavLink to="/transfer-history-currency">Transfer history</NavLink>
                                <a
                                    id='open-issue-currency-mobile'
                                    onClick={() => dispatch(setBodyModalParamsAction('ISSUE_CURRENCIES'))}
                                >
                                    Issue Currencies
                                </a>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                { smartContractAddress !== '#' && (
                    <NavLink to={{pathname:smartContractAddress}} target='_blank' className="w-100">
                        <AccordionItem>
                            <div className={"mobile-nav-item"}>
                                <AccordionItemHeading
                                    className={'text'}>
                                    <AccordionItemButton>
                                        <i className="zmdi zmdi-collection-text left"/>Contracts<span
                                        className="arrow"/>
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                            </div>
                        </AccordionItem>
                    </NavLink>
                )}

                {process.env.REACT_APP_DFS_URL && (
                    <NavLink to={{pathname: process.env.REACT_APP_DFS_URL}} target='_blank' className="w-100">
                        <AccordionItem>
                            <div className={"mobile-nav-item"}>
                                <AccordionItemHeading
                                    className={'text'}>
                                    <AccordionItemButton>
                                        <i className="zmdi zmdi-storage left"/>Distributed file storage <span
                                        className="arrow"/>
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                            </div>
                        </AccordionItem>
                    </NavLink>
                )}

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass(["/active-polls",
                                "/finished-polls",
                                "/followed-polls",
                                "/my-votes",
                                "/my-polls"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-star"/>Voting system
                                <span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink to="/active-polls">Active polls</NavLink>
                                <NavLink to="/finished-polls">Finished polls</NavLink>
                                <NavLink to="/followed-polls">Followed polls</NavLink>
                                <NavLink to="/my-votes">My votes</NavLink>
                                <NavLink to="/my-polls">My polls</NavLink>

                                <a
                                    id='open-create-poll-mobile'
                                    onClick={() => dispatch(setBodyModalParamsAction('ISSUE_POLL'))}
                                >
                                    Create poll
                                </a>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass(["/data-storage"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-dns"/>Data storage<span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink to="/data-storage">Search</NavLink>

                                <a
                                    id='open-file-upload-mobile'
                                    onClick={() => dispatch(setBodyModalParamsAction('ISSUE_FILE_UPLOAD'))}
                                >
                                    File upload
                                </a>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass(["/my-products-for-sale",
                                "/my-pending-orders",
                                "/recent-listing",
                                "/my-completed-orders"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-label"/>Marketplace<span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                {window.innerHeight < 768 && <NavLink to="/marketplace">Marketplace</NavLink>}

                                <NavLink to="/purchased-products">Purchased Products</NavLink>
                                <NavLink to="/my-products-for-sale">My products for sale</NavLink>
                                <NavLink to="/my-pending-orders">My pending orders</NavLink>
                                <NavLink to="/my-completed-orders">My completed orders</NavLink>
                                <a
                                    id='open-list-product-for-sale-mobile'
                                    onClick={() => dispatch(setBodyModalParamsAction('LIST_PRODUCT_FOR_SALE'))}
                                >
                                    List product for sale
                                </a>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass([
                                "/active-shuffling",
                                "/finished-shuffling",
                                "/my-shuffling"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-circle-o"/>Coin shuffling
                                <span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink to="/active-shuffling">Active shuffling</NavLink>
                                <NavLink to="/finished-shuffling">Finished shuffling</NavLink>
                                <NavLink to="/my-shuffling">My shuffling</NavLink>
                                <a
                                    id='open-create-shuffling-mobile'
                                    onClick={() => dispatch(setBodyModalParamsAction('ISSUE_CREATE_SHUFFLING'))}
                                >
                                    Create shuffling
                                </a>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading
                            className={`text ${getNavLinkClass(["/messenger", "/my-messages"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-comments"/>Messages<span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink exact={true} activeClassName="active" to="/my-messages">My messages</NavLink>
                                <NavLink exact={true} activeClassName="active" to="/messenger">Chat</NavLink>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>

                <AccordionItem>
                    <div className={"mobile-nav-item"}>
                        <AccordionItemHeading className={`text ${getNavLinkClass(["/aliases", "/my-aliases"])}`}>
                            <AccordionItemButton>
                                <i className="zmdi zmdi-comments"/>Search Aliases<span className="arrow"/>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="item-dropdown">
                                <NavLink exact={true} activeClassName="active" to="/aliases" className={"mobile-nav-item"}>
                                    Search Aliases
                                </NavLink>
                                <NavLink exact={true} activeClassName="active" to="/my-aliases"
                                        className={"mobile-nav-item"}>
                                    My Aliases
                                </NavLink>
                            </div>
                        </AccordionItemPanel>
                    </div>
                </AccordionItem>
            </Accordion>

            <div className="btn-block text-center">
                <div className="btn btn-default btn-sm" onClick={closeMenu}>
                    Close
                </div>
            </div>
        </>
    )
}

export default MobileMenu;
