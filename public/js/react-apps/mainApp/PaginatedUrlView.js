import React from 'react';
import Paper from '@material-ui/core/Paper';
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

export default class PaginatedUrlView extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			filteredUrls: [],
			selectedCategory: "",
			page: 0,
			rowsPerPage: 1
		}
		
		this.sliceUrls = this.sliceUrls.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleRowsPerPageChange = this.handleRowsPerPageChange.bind(this);
	}

	filterUrlsByCategory(){
		return this.props.urls.filter(url => url.Category.Id === this.state.selectedCategory);
	}
	
	sliceUrls() {
		let urls = this.filterUrlsByCategory(this.state.selectedCategory);
		
		let beginSliceIndex = this.state.page * this.state.rowsPerPage,
			endSliceIndex = beginSliceIndex + this.state.rowsPerPage;
		
		return urls.slice(beginSliceIndex, endSliceIndex);
	}

	handleCategoryChange(event) {
		let category = event.target.value;

		this.setState({
			selectedCategory: category
		});
	}

	handlePageChange(event, page) {
		console.log(page);

		this.setState({
			page: page
		});
	}

	handleRowsPerPageChange(event) {
		console.log(event);

		this.setState({
			rowsPerPage: event.target.value
		});
	}

	render() {
		let urls = (
			<div className = "loaderContainer">
				<CircularProgress color = "secondary" />
			</div>
		);

		if (this.props.urls) {
			urls = (
				<React.Fragment>
					<Toolbar>
						<Typography 
							variant="h6"
							id="tableTitle"
							style = {{flexGrow: 1}}
						>
							URLs
						</Typography>
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
						
					</Toolbar>
					<div className = "tableContainer">
						<Table>
							<TableHead>
								<TableRow>
							    	<TableCell padding = "dense">URL</TableCell>
							    	<TableCell align="center" padding = "dense">Description</TableCell>
							    	<TableCell align="center" padding = "dense">Category</TableCell>
							    	<TableCell align="center" padding = "dense">Added On</TableCell>
								</TableRow>
							</TableHead>
							
							<TableBody>
								{
									this.sliceUrls().map((url) => {
										return (
											<TableRow key = {`url-${url.Id}`}>
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
					<TablePagination
						component="div"
						count = {this.filterUrlsByCategory().length}
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
		return (
			<Paper>
				{urls}
			</Paper>
		);
	}
}