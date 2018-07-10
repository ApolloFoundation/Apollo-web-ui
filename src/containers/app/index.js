import React from 'react';
import { Route, Link, Redirect } from 'react-router-dom'

// pages components
import Home from '../home'
import About from '../about'
import Dashboard from "../dashboard";

import style from  './App.css';
console.log(style);

const App = () => (
	<div>
		<header>
			<Link to="/">Home</Link>
			<Link to="/about-us">About</Link>
		</header>
		
		<main className="site-content">
			<Route exact path="/" render={<Redirect to="/dashboard"/>}>

			</Route>
			<Route exact path="/dashboard" component={Dashboard}></Route>
			<Route exact path="/about-us" component={About} />
		</main>
	</div>
);

export default App;