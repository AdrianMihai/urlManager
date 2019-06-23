import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import PaginatedUrlView from './PaginatedUrlView';
import NotificationsSnackbar from './NotificationsSnackbar';
import UrlEditorForm from './UrlEditorForm';

import Grid from '@material-ui/core/Grid';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import {amber, lightBlue, green} from '@material-ui/core/colors';
import "@babel/polyfill";


const theme = createMuiTheme({
	palette: {
	    primary: amber,
		secondary: lightBlue,
		success: green
	},
	typography: {
		useNextVariants: true,
	}
});

class App extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			userData: {},
			urlCategories: [],
			snackbarOpener: null,
			editorOpener: null,
			filterLinksFunction: null
		}
		
		this.getSnackbarOpener = this.getSnackbarOpener.bind(this);
		this.getEditorOpener = this.getEditorOpener.bind(this);
		this.acquireFilterLinksFunction = this.acquireFilterLinksFunction.bind(this);
	}
	
	getSnackbarOpener(opener) {
		//opener('error', 'error');
		this.setState({
			snackbarOpener: opener
		});
	}

	getEditorOpener(opener) {
		this.setState({
			editorOpener: opener
		});
	}

	/*updateUrl(url) {
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
	}*/
	
	acquireFilterLinksFunction(func) {
		if (func) {
			this.setState({
				filterLinksFunction: func
			});
		}
	}

	async fetchAppData() {
		let userData = await postData('/userData');
		let urlCategories = await postData('/urlCategories');
		//let urls = await postData('/getUrls');

		this.setState({
			userData: userData,
			urlCategories: urlCategories,
		});
	}

	componentDidMount() {
		this.fetchAppData();
	}

	render() {
		return (
			<MuiThemeProvider theme = {theme}>
				
				<Navbar 
					username = {typeof this.state.userData.Username == "undefined" ? "Username" : this.state.userData.Username}
				/>
				<Grid
					className = "main-container"
					spacing = {16}
					justify = "center"
					container
				>
					
					<Grid item xs = {12} >
						<PaginatedUrlView 
							categories = {this.state.urlCategories}
							shareFilterLinksFunction = {this.acquireFilterLinksFunction}
							openSnackbar = {this.state.snackbarOpener}
							openEditor = {this.state.editorOpener}
						/>
					</Grid>
				</Grid>
				
				<UrlEditorForm 
					categories = {this.state.urlCategories}
					shareOpener = {this.getEditorOpener}
					openSnackbar = {this.state.snackbarOpener}
					filterLinks = {this.state.filterLinksFunction}
				/>
				<NotificationsSnackbar shareOpener = {this.getSnackbarOpener} />
          
			</MuiThemeProvider>
		);
	}

	componentDidUpdate() {
		//console.log(this.state);
	}
}

ReactDOM.render(<App />, document.getElementById("react"));