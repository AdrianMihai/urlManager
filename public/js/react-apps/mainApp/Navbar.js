import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default class Navbar extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<AppBar position="fixed">
				<Toolbar>
			  		<Typography variant = "title" color="inherit" noWrap style = {{flexGrow: 1}}>
				  		Link Manager
			  		</Typography>
					
					<Typography variant="subheading" color="inherit" noWrap gutterBottom
						align="right" style = {{marginRight: '1em'}}
					>
          				{this.props.username}
        			</Typography>

			  		<Button variant = "contained" href = "/logout" color = "secondary" align="right">
						Log out
			  		</Button>
				</Toolbar>
			</AppBar>
		);
	}

	componentDidUpdate() {
		//console.log(this.props);
	}
}