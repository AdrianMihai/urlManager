import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Icon from '@material-ui/core/Icon';
import { withTheme } from '@material-ui/core/styles';

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class UrlEditorForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			selectedLinkId: null,
			selectedCategory: "1",
			currentLink: "",
			currentDescription: ""
		}
		
		this.openForm = this.openForm.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleUrlChange = this.handleUrlChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.populateForm = this.populateForm.bind(this);
		this.preventUpdate = this.preventUpdate.bind(this);
	}
	
	openForm(event, url = null) {
		if (url) {
			console.log(url);
			this.setState({
				isOpen: true,
				selectedLinkId: url.Id,
				selectedCategory: url.Category,
				currentLink: url.Link,
				currentDescription: url.Description
			});
		}
		else {
			this.setState({
				isOpen: true
			});
		}
	}

	handleClose(event, reason) {
		this.preventUpdate(event);
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
		
		if (this.state.currentLink.length === 0) {
			this.props.openSnackbar("The link must be specified.", "error");
		}
		else if (this.state.currentDescription.length === 0 ) {
			this.props.openSnackbar("You need to specify a description for the url.", "error");
		}
		else {
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

					this.props.filterLinks();

					this.setState({
						isOpen: false,
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
					this.props.filterLinks();
					
					this.preventUpdate();
				}

				console.log(updateResult);
			}
		}
		
		
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
			isOpen: false,
			selectedLinkId: null,
			selectedCategory: "1",
			currentLink: "",
			currentDescription: ""
		});
	}

	componentDidMount() {
		this.props.shareOpener(this.openForm);
	}

	render() {
		let preventUpdateButton = <React.Fragment> </React.Fragment>;
		
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

		return (
			<Dialog
				keepMounted
				fullWidth
				maxWidth = 'md'
      			open = {this.state.isOpen}
      			TransitionComponent = {Transition}
      			onClose = {this.handleClose}
      			aria-labelledby = "alert-dialog-slide-title"
      			aria-describedby = "alert-dialog-slide-description"
    		>
				<DialogTitle id="alert-dialog-slide-title">
					Link Editor
				</DialogTitle>

				<DialogContent className = "dialog-content-abstract-upload">
            		<form className = "url-editor" onSubmit = {this.handleFormSubmit}>
						
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
							onChange = {this.handleCategoryChange}
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
          		</DialogContent>
				<DialogActions>
					{preventUpdateButton}
				</DialogActions>
        	</Dialog>
		);
	}
}

export default withTheme()(UrlEditorForm);
