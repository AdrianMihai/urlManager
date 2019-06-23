import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles';

class ConfirmationDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Dialog
		        open = {this.props.isOpen}
		        onClose = {this.props.closeDialogHandler}
		        aria-labelledby="alert-dialog-title"
		        aria-describedby="alert-dialog-description"
		      >
		        <DialogTitle id="alert-dialog-title">
		        	{this.props.title}
	        	</DialogTitle>
		        <DialogContent>
					<DialogContentText id = "alert-dialog-description">
						{this.props.textContent}
					</DialogContentText>
		        </DialogContent>
		        <DialogActions>
				<Button onClick = {this.props.closeDialogHandler} color="secondary">
					No
				</Button>
				<Button onClick = {this.props.confirmedOperation} color="primary" autoFocus>
					Yes
				</Button>
		        </DialogActions>
	      	</Dialog>
		);
		
	}
}

export default withTheme()(ConfirmationDialog);