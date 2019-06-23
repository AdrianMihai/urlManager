import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { withTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

class NotificationsSnackbar extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			message: "",
			isOpen: false,
			variant: 'error'
		};

		this.variantMappings = {
			success: {
				icon: "check_circle_outline",
				color: green[600]
			},
			error: {
				icon: "error_outline",
				color: this.props.theme.palette.error.dark
			}
		};

		this.openSnackbar = this.openSnackbar.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
	}

	openSnackbar(message, variant) {
		this.setState({
			isOpen: true,
			message: message,
			variant: variant
		});
	}

	closeSnackbar() {
		this.setState({
			isOpen: false
		});
	}

	componentDidMount() {
		this.props.shareOpener(this.openSnackbar);
	}

	render() {
		return (
			<Snackbar
				anchorOrigin = {{
					vertical: 'bottom',
					horizontal: 'right',
				}}
	          	open = {this.state.isOpen}
	          	onClose = {this.closeSnackbar}
	          	autoHideDuration = {5000}
	        >
				<SnackbarContent
					style = {{
						backgroundColor: this.variantMappings[this.state.variant].color		
					}}
					aria-describedby="client-snackbar"
					message = {
						<span 
							id = "client-snackbar"
							style = {{
								display: 'flex',
    							alignItems: 'center'
							}}
						>
							<Icon
								style = {{marginRight: `${this.props.theme.spacing.unit}px`}}
							>
								{this.variantMappings[this.state.variant].icon}
							</Icon>
						  {this.state.message}
						</span>
					}
			    	action = {[
				        <IconButton
				          key="close"
				          aria-label="Close"
				          color="inherit"
				          className = ""
				          onClick = {this.closeSnackbar}
				        >
			        		<CloseIcon className="" />
			        	</IconButton>,
			    	]}
			    />
	        </Snackbar>
		);
	}
}

export default withTheme()(NotificationsSnackbar);