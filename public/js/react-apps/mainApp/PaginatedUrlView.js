import React from 'react';

import ConfirmationDialog from './ConfirmationDialog';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import NativeSelect from '@material-ui/core/NativeSelect';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import { withTheme } from '@material-ui/core/styles';
import "@babel/polyfill";

class PaginatedUrlView extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			totalCount: 0,
			filteredUrls: [],
			isLoading: false,
			isDeleteDialogOpen: false,
			selectedCategory: "",
			page: 0,
			rowsPerPage: 1,
			selectedUrlForDelete: null
		}
		
		this.deleteUrl = this.deleteUrl.bind(this);
		this.sliceUrls = this.sliceUrls.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleRowsPerPageChange = this.handleRowsPerPageChange.bind(this);
	}
	
	closeDeleteDialog() {
		this.setState({
			isDeleteDialogOpen: false,
			selectedUrlForDelete: null
		});
	}

	openDeleteDialog(url) {
		this.setState({
			isDeleteDialogOpen: true,
			selectedUrlForDelete: url
		});
	};

	async sliceUrls() {
		let response = await postData('/filterUrls', {
			category: this.state.selectedCategory,
			page: this.state.page,
			rowsPerPage: this.state.rowsPerPage
		});

		if (response.status === "OK") {
			
			this.setState({
				totalCount: response.message.categoryCount,
				filteredUrls: response.message.urls,
				isLoading: false
			});
		}
		
	}

	handleCategoryChange(event) {
		let category = event.target.value;
		
		this.setState({
			selectedCategory: category,
			isLoading: true
		});

	}

	handlePageChange(event, page) {

		this.setState({
			page: page,
			isLoading: true
		});

	}

	handleRowsPerPageChange(event) {

		this.setState({
			rowsPerPage: event.target.value,
			isLoading: true
		});
	}

	async deleteUrl(event) {
		
		let deleteResult = await postData('/deleteUrl', {
			urlId: this.state.selectedUrlForDelete.Id
		});
		
		if (deleteResult.status === "OK") {
			this.props.openSnackbar("URL successfully deleted!", "success");
			this.sliceUrls();
			this.closeDeleteDialog();
		}
		else if (deleteResult.status === "ERROR"){
			this.props.openSnackbar(deleteResult.message, "error");
			this.closeDeleteDialog();
		}
		
		console.log(deleteResult);
	}
	
	componentDidMount() {
		this.props.shareFilterLinksFunction(this.sliceUrls);
	}

	getLoader() {
		return (
			<div className = "loaderContainer">
				<CircularProgress color = "secondary" />
			</div>
		);
	}

	render() {
		let urls = this.getLoader(),
		table = <React.Fragment></React.Fragment>;

		if (this.props.categories.length > 0) {
			

			//decide the content of the table and store in the table variable
			if (this.state.selectedCategory.length === 0) {
				table = (
					<Typography
						variant = 'h6'
						style = {{
							textAlign: 'center',
							padding: '1rem'
						}}
					>
						No category has been selected.
					</Typography>
				);
			}
			else {
				if (this.state.filteredUrls.length > 0) {
					table = (
						<div className = "tableContainer">
							<Table>
								<TableHead>
									<TableRow>
								    	<TableCell padding = "dense">Link</TableCell>
								    	<TableCell align="center" padding = "dense">Description</TableCell>
								    	<TableCell align="center" padding = "dense">Category</TableCell>
								    	<TableCell align="center" padding = "dense">Added On</TableCell>
								    	<TableCell padding = "dense"></TableCell>
									</TableRow>
								</TableHead>
								
								<TableBody>
									{
										this.state.filteredUrls.map((url) => {
											return (
												<TableRow 
													key = {`url-${url.Id}`}
													className = "selectableRow"
													onDoubleClick = { (event) => {this.props.openEditor(event, url);} }
												>

													<TableCell padding = "dense">
														<Link 
															target = "_blank"
															color = "secondary"
															component = "a"
															rel="noopener"
															href = {url.Link}>
															{url.Link}
														</Link>
													</TableCell>

													<TableCell align="center" padding = "dense">
														{url.Description}
													</TableCell>

													<TableCell align="center" padding = "dense">
														{
															this.props.categories
															.find(category => category.Id === url.Category).Name
														}
													</TableCell>

													<TableCell align="center" padding = "dense">{url.AddedOn}</TableCell>

													<TableCell align="center">
														<IconButton
															onClick = { (event) => {this.openDeleteDialog(url)}}
														>
															<Icon color = "error">
																delete_forever
															</Icon>
														</IconButton>
													</TableCell>
											    </TableRow>
											);
										})
									}
								    
								</TableBody>
							</Table>
						</div>
						
					);
				}
				else {
					if (this.state.isLoading === false){
						table = (
							<Typography
								variant = "h6"
								style = {{
									textAlign: 'center',
									padding: '1rem'
								}}
							>
								No links could be found.
							</Typography>
						); 
					}
					else {
						table = this.getLoader();
					}
				}
			}
			

			//the toolbar, the table and the table pagination are stored in the urls variable
			//when the categories of the urls have been loaded
			urls = (
				<React.Fragment>
					<Toolbar className = "links-table-toolbar">
						<Grid
							container
						>
							<Grid
								item 
								xs = {12}
								md = {6}
							>
								<Typography 
									variant="h5"
									id = "tableTitle"
									style = {{flexGrow: 1}}
								>
									Your Links
								</Typography>
							</Grid>

							<Grid
								item 
								xs = {12}
								md = {6}

								style = {{textAlign: 'right'}}
							>

								<Button 
									variant="contained"
									style = {{
										marginRight: `${this.props.theme.spacing.unit * 2}px`,
										backgroundColor: green[500],
										color: "#FFF"
									}}
									onClick = {this.props.openEditor}
								>
						        	Add Url
						        	<Icon
										style = {{marginLeft: `${this.props.theme.spacing.unit}px`}}
						        	>
										library_add
						        	</Icon>
					      		</Button>

					      		<FormControl style = {{minWidth: '120px'}}>
									<Select
										native
							            value = {this.state.selectedCategory}
							            onChange = {this.handleCategoryChange}
							            
						          	>
						          		<option value = "">None</option>
						          		{
						          			this.props.categories.map((category) => {
												return (
													<option key = {`category${category.Id}`} value = {category.Id}>
				  										{category.Name}
													</option>
												);
												
											})
						          		}

						          	</Select>
						          	<FormHelperText>Category</FormHelperText>
								</FormControl>

					      	</Grid>
								
						</Grid>
					</Toolbar>
					
					{table}

					<TablePagination
						component="div"
						count = {this.state.totalCount}
						rowsPerPage = {this.state.rowsPerPage}
						rowsPerPageOptions = {[1, 2, 3, 4]}
						page = {this.state.page}
						backIconButtonProps={{
							'aria-label': 'Previous Page',
						}}
						nextIconButtonProps={{
							'aria-label': 'Next Page',
						}}
						onChangePage = {this.handlePageChange}
						onChangeRowsPerPage = {this.handleRowsPerPageChange}
			        />
				</React.Fragment>
			);
		}
		
		//render the table inside a paper component
		return (
			<React.Fragment>
				<Paper className = "paper-container">
					{urls}
				</Paper>

				<ConfirmationDialog
					title = {
						this.state.selectedUrlForDelete ? "Are you sure you want to delete the selected item?" : ""
					}
					textContent = {
						this.state.selectedUrlForDelete 
						? (
							<React.Fragment>
								The link <Link 
									target = "_blank"
									color = "primary"
									component = "a"
									rel = "noopener"
									href = {this.state.selectedUrlForDelete.Link}>
									<strong>{this.state.selectedUrlForDelete.Link + " "}</strong>
								</Link>
								will be permanently <strong style = {{color: this.props.theme.palette.error.main}}>
								deleted</strong> and the operation cannot be undone.
							</React.Fragment>
						) : ""
						
					}
					isOpen = {this.state.isDeleteDialogOpen}
					closeDialogHandler = {this.closeDeleteDialog}
					confirmedOperation = {this.deleteUrl}
				/>
			</React.Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.selectedCategory != prevState.selectedCategory || 
			this.state.page != prevState.page ||
			this.state.rowsPerPage != prevState.rowsPerPage
		) {
			this.sliceUrls();
		}
	}
}

export default withTheme()(PaginatedUrlView);