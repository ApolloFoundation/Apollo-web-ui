import React from 'react';
import { Route, Link, Redirect } from 'react-router-dom'

// components
import SideBar from '../components/sidebar'

// pages components
import Home from '../account/home'
import About from '../account/about'
import Ledger from '../account/ledger'
import Dashboard from "../account/dashboard";

import style from  './App.css';
console.log(style);

const App = () => (
	<div>
		<header>
			<Link to="/">Home</Link>
			<Link to="/about-us">About</Link>
            <SideBar/>
		</header>
		
		<main className="site-content">
			<Route exact path="/">
                <Redirect to="/dashboard"/>
			</Route>
			<Route exact path="/dashboard"    component={Dashboard}/>
			<Route exact path="/transactions" component={Dashboard}/>
			<Route exact path="/ledger"       component={Ledger}/>
			<Route exact path="/about-us"     component={About} />
		</main>
	</div>
);

export default App;