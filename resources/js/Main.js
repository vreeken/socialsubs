import React from 'react';

import {BrowserRouter} from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';

import { setGlobal } from 'reactn';

import Layout from './layout/Layout';

import HomePage from './pages/Home';
import WatchPage from './pages/Watch';
import MoviesPage from './pages/Movies';
import LoginPage from './pages/Login';
import LogoutPage from './pages/Logout';
import RegisterPage from './pages/Register';
import AboutPage from './pages/About';
import AccountPage from './pages/Account';


//Make axios accessible everywhere
window.axios = require('axios');
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

//Add Laravel's CSRF token to all axios calls
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
	axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
	console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

//Make Toast accessible everywhere
window.Toast = require('./components/toast/Toast').default;

//TODO consider moving everything from global state to localstorage
//TODO remove all "mm" minor mistakes from json file. there will be enough going on to not warrant them.

//Global State object, mostly used for caching
setGlobal({
	user: null, //the authenticated user object
	movies: null, //used within pages/Movies.js to cache movies.json for possible repeated calls
	movie: null, //used within pages/Watch.js containing the movie.json data
	watchPageState: {
		runningTime: 0,
		currentSub: null,
		currentSubIndex: -1,
		movieId: null,
		status: 0
	},
	redirectUrl: null
});

function Main() {
	return (
		<BrowserRouter>
			<Layout>
				<Switch className="page-container">
					<Route path="/" exact component={HomePage}/>
					<Route path="/movies" exact component={MoviesPage}/>
					<Route path={'/watch/:id'} component={WatchPage}/>
					<Route path={'/about'} component={AboutPage}/>
					<Route path={'/login'} component={LoginPage}/>
					<Route path={'/register'} component={RegisterPage}/>
					<Route path={'/account'} component={AccountPage}/>
					<Route path={'/logout'} component={LogoutPage}/>
				</Switch>
			</Layout>
		</BrowserRouter>
	);
}

export default Main;