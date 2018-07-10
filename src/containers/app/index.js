import React from 'react';
import { Route, Link } from 'react-router-dom'
import Home from '../home'
import About from '../about'

import style from  './App.css';

console.log(style);

const App = () => (
	<div>
		<header>
			<Link to="/">Home</Link>
			<Link to="/about-us">About</Link>
		</header>
		
		<main>
			<div className="site-content">
				<div className="container">
					<h1>dddd</h1>
				</div>
			</div>
			<Route exact path="/" component={Home} />
			<Route exact path="/about-us" component={About} />
		</main>
	</div>
);

export default App;