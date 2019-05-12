import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { withTheme } from '@material-ui/core/styles';
import "@babel/polyfill";

class UrlEditor extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			filterField: "",
			selectedLinkId: null,
			selectedCategory: "1",
			currentLink: "",
			currentDescription: ""
		}
		
		this.handleFilterFieldChange = this.handleFilterFieldChange.bind(this);
		this.handleUrlChange = this.handleUrlChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.deleteUrl = this.deleteUrl.bind(this);
		this.populateForm = this.populateForm.bind(this);
		this.preventUpdate = this.preventUpdate.bind(this);
		this.filterUrls = this.filterUrls.bind(this);
	}
	
	handleFilterFieldChange(event) {
		this.setState({
			filterField: event.target.value
		});
	}

	handleUrlChange(event) {
		this.setState({
			currentLink: event.target.value
		});
	}
	
	handleDescriptionChange(event) {
		this.setState({
			currentDescription: event.target.value
		});
	}

	handleCategoryChange(event) {
		this.setState({
			selectedCategory: event.target.value
		});
	}

	async handleFormSubmit(event) {
		event.preventDefault();
		
		if (!this.state.selectedLinkId) {
			let result = await postData('/addUrl', {
				category: this.state.selectedCategory,
				link: this.state.currentLink,
				description: this.state.currentDescription
			});
		
			if (result.status === "ERROR") {
				this.props.openSnackbar(result.message, "error");
			}
			else if (result.status === "OK") {
				this.props.openSnackbar("URL successfully added!", "success");
				this.props.addUrl(result.message);
				this.setState({
					selectedCategory: "1",
					currentLink: "",
					currentDescription: ""
				});

			}
			console.log(result);
		}
		else {
			let updateResult = await postData('/updateUrl', {
				urlId: this.state.selectedLinkId,
				urlCategory: this.state.selectedCategory,
				link: this.state.currentLink,
				urlDescription: this.state.currentDescription
			});
			
			if (updateResult.status === "ERROR") {
				this.props.openSnackbar(updateResult.message, "error");
			}
			else if (updateResult.status === "OK") {
				this.props.openSnackbar("URL successfully updated!", "success");
				this.props.updateUrl(updateResult.message);
				this.preventUpdate();
			}

			console.log(updateResult);
		}
		
	}
	
	async deleteUrl(event, urlId) {
		
		console.log(urlId);
		
		let deleteResult = await postData('/deleteUrl', {
			urlId: urlId
		});
		
		if (deleteResult.status === "OK") {
			this.props.openSnackbar("URL successfully deleted!", "success");
			this.props.removeUrl(urlId);
		}
		else if (deleteResult.status === "ERROR"){
			this.props.openSnackbar(deleteResult.message, "error");
		}
		
		console.log(deleteResult);
	}

	populateForm(event, url) {
		console.log(url);

		this.setState({
			selectedLinkId: url.Id,
			currentLink: url.Link,
			currentDescription: url.Description,
			selectedCategory: url.Category.Id 
		});
	}

	preventUpdate(event = {}) {
		this.setState({
			selectedLinkId: null,
			selectedCategory: "1",
			currentLink: "",
			currentDescription: ""
		});
	}
	
	filterUrls() {
		let filteredUrls = this.props.urls;
		if (this.state.filterField.length > 0) {
			filteredUrls = filteredUrls.filter((url) => {
				return (
					url.Link.toLowerCase().match(new RegExp(this.state.filterField.toLowerCase()))
					|| url.Category.Name.toLowerCase().match(new RegExp(this.state.filterField.toLowerCase()))
					|| url.Description.toLowerCase().match(new RegExp(this.state.filterField.toLowerCase()))
				);
			});
		}

		return filteredUrls;
	}

	render() {
		let urls = (
			<div className = "loaderContainer">
				<CircularProgress color = "secondary" />
			</div>
		),
			preventUpdateButton = <React.Fragment> </React.Fragment>;
		
		if (this.state.selectedLinkId) {
			preventUpdateButton = (
				<Button 
					variant="contained"
					style = {
						{
							backgroundColor: this.props.theme.palette.error.dark,
							color: this.props.theme.palette.error.contrastText,
						}
					}
					onClick = {this.preventUpdate}
				>
						Prevent Update
					<Icon 
						style = {
							{
								marginLeft: `${this.props.theme.spacing.unit}px`
							}
						}
					>
						update
					</Icon>
				</Button>
			);
		}

		if (this.props.urls) {
			if (this.props.urls.length > 0) {
				let filteredUrls = this.filterUrls();
				
				urls = (
					<React.Fragment>
						<div className = "tableContainer">
							<Table className = "urls-table">

								<TableHead>
									<TableRow>
										<TableCell padding = "dense"></TableCell>
								    	<TableCell padding = "dense">URL</TableCell>
								    	<TableCell align="center" padding = "dense">Description</TableCell>
								    	<TableCell align="center" padding = "dense">Category</TableCell>
								    	<TableCell align="center" padding = "dense">Added On</TableCell>
									</TableRow>
								</TableHead>
								
								<TableBody>
									{

										filteredUrls.map((url) => {
											return (
												<TableRow 
													key = {`url-${url.Id}`}
													className = "selectableRow"
													onDoubleClick = { (event) => {this.populateForm(event, url);} }
												>
													<TableCell align="center">
														<IconButton
															onClick = { (event) => {this.deleteUrl(event, url.Id); }}
														>
															<Icon color = "error">
																delete_forever
															</Icon>
														</IconButton>
													</TableCell>
													<TableCell padding = "dense">
														<Link 
															target = "_blank"
															color = "secondary"
															component = "a"
															rel="noopener"
															href = {url.Link}
														>
															{url.Link}
														</Link>
													</TableCell>
													<TableCell align="center" padding = "dense">
														{url.Description}
													</TableCell>
													<TableCell align="center" padding = "dense">
														{url.Category.Name}
													</TableCell>
													<TableCell align="center" padding = "dense">{url.AddedOn}</TableCell>
											    </TableRow>
											);
										})
									}
								    
								</TableBody>
							</Table>
						</div>
						<TextField
							id="link-filter"
							label="Filter urls"
							type="search"
							margin="normal"
							variant="filled"
							value = {this.state.filterField}
							onChange = {this.handleFilterFieldChange}
							fullWidth
						/>
					</React.Fragment>
				);
			}
			else {
				urls = (
					<Typography align = "center" variant = "h5" className = "noUrlsText">
						You haven't added any urls yet!
					</Typography>
				);
			}
			
		}

		return (
			<Paper>
				{urls}
				<form className = "url-editor" onSubmit = {this.handleFormSubmit}>
					<Grid
						className = "editor-header"
						spacing = {16}
						justify = "space-between"
						container
					>

						<Grid item xs = {6}>
							<Typography variant="title" color="inherit" noWrap gutterBottom>
  								Editor:
							</Typography>
						</Grid>

						<Grid item xs = {6} style = {{textAlign: 'right'}}>
							{preventUpdateButton}
						</Grid>
					</Grid>
					
					<TextField
						id="url"
						label="Link"
						value = {this.state.currentLink}
						onChange={this.handleUrlChange}
						margin="normal"
						variant="outlined"
						fullWidth
					/>

					<TextField
						id = "description"
						label="Description"
						value = {this.state.currentDescription}
						onChange = {this.handleDescriptionChange}
						margin = "normal"
						variant = "outlined"
						fullWidth
					/>

					<TextField
						id="url-category"
						label="Category"
						SelectProps={{
				            native: true,
				        }}
						value = {this.state.selectedCategory}
						onChange={this.handleCategoryChange}
						margin="normal"
						variant="outlined"
						fullWidth
						select
					>
						{
							this.props.categories.map((category) => {
								return (
									<option key = {`category${category.Id}`} value = {category.Id}>
  										{category.Name}
									</option>
								);
								
							})
						}
						
					</TextField>
					<Button variant = "outlined" color = "secondary" type = "submit">
						Save changes
	  				</Button>
				</form>
			</Paper>
		);
	}

	componentDidUpdate() {
		//console.log(this.props);
	}
}


export default withTheme()(UrlEditor);