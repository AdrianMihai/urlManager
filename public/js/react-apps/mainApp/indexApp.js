import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import PaginatedUrlView from './PaginatedUrlView';
import UrlEditor from './UrlEditor';
import NotificationsSnackbar from './NotificationsSnackbar';

import Grid from '@material-ui/core/Grid';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import {amber, lightBlue} from '@material-ui/core/colors';
import "@babel/polyfill";

function colorTheme(theme) {
	return createMuiTheme({
		...theme,
		palette: {
		    primary: amber,
			secondary: lightBlue
		},
	});
}

class App extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			userData: {},
			urlCategories: [],
			urls: null,
			snackbarOpener: null
		}
		
		this.addNewUrl = this.addNewUrl.bind(this);
		this.removeUrl = this.removeUrl.bind(this);
		this.updateUrl = this.updateUrl.bind(this);
		this.getSnackbarOpener = this.getSnackbarOpener.bind(this);
	}
	
	getSnackbarOpener(opener) {
		//opener('error', 'error');
		this.setState({
			snackbarOpener: opener
		});
	}
	
	addNewUrl(url) {
		let urls = this.state.urls;
		urls.push(url);

		this.setState({
			urls
		});
	}

	updateUrl(url) {
		let urlIndex = this.state.urls.map(u => u.Id).indexOf(url.Id);

		if (urlIndex >= 0) {
			let urls = this.state.urls;
			urls[urlIndex] = url;

			this.setState({
				urls: urls
			});
		}
		else {
			console.log("Url couldn't be updated!");
		}
	}
	
	removeUrl(urlId) {
		this.setState({
			urls: this.state.urls.filter(url => url.Id != urlId)
		});
	}

	async fetchAppData() {
		let userData = await postData('/userData');
		let urlCategories = await postData('/urlCategories');
		let urls = await postData('/getUrls');

		console.log(urls);

		this.setState({
			userData: userData,
			urlCategories: urlCategories,
			urls: urls
		});
	}

	componentDidMount() {
		this.fetchAppData();
	}

	render() {
		return (
			<MuiThemeProvider theme = {colorTheme}>
				
				<Navbar 
					username = {typeof this.state.userData.Username == "undefined" ? "Username" : this.state.userData.Username}
				/>
				<Grid
					className = "main-container"
					spacing = {16}
					justify = "center"
					container
				>

					<Grid item xs = {12} lg = {6}>
						<UrlEditor 
							urls = {this.state.urls}
							categories = {this.state.urlCategories}
							addUrl = {this.addNewUrl}
							removeUrl = {this.removeUrl}
							updateUrl = {this.updateUrl}
							openSnackbar = {this.state.snackbarOpener}
						/>
					</Grid>

					<Grid item xs = {12} lg = {6} >
						<PaginatedUrlView 
							urls = {this.state.urls}
							categories = {this.state.urlCategories}
						/>
					</Grid>
				</Grid>

				<NotificationsSnackbar shareOpener = {this.getSnackbarOpener} />
          
			</MuiThemeProvider>
		);
	}

	componentDidUpdate() {
		//console.log(this.state);
	}
}

ReactDOM.render(<App />, document.getElementById("react"));