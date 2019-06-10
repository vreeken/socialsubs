import React from 'react';
import Snackbar from '@material-ui/core/Snackbar/index';
import {EventBus} from "../utilities/EventBus";


class Toast extends React.Component {
	constructor(props) {
		super(props);

		this.DEFAULT_DURATION = 4000;
		this.DURATIONS = {
			"short": 2000,
			"med": 4000,
			"medium": 4000,
			"default": 4000,
			"long": 6000
		};

		this.TYPES = {
			"default": '',
			"success": 'success',
			"warning": 'warning',
			"fail": 'fail',
			"failure": 'fail',
			"error": 'fail',
		};

		this.state = {
			open: false,
			message: '',
			duration: 4000,
			type: 'default'
		};

		EventBus.listen('showToast', (data) => this.showToast(data));
	}

	setOpen(b) {
		this.setState({open: b});
	}
	setMessage(m) {
		this.setState({message: m});
	}
	setDuration(d) {
		this.setState({duration: d});
	}
	setType(c) {
		this.setState({type: c});
	}

	showToast(data) {
		//Set autohide duration if found on the data object
		if (data.duration && typeof data.duration === "number") {
			this.setDuration(data.duration);
		}
		else if (data.duration && typeof data.duration === "string") {
			this.setDuration(this.DURATIONS[data.duration] || 4000);
		}
		else {
			this.setDuration(this.DEFAULT_DURATION);
		}

		//Set type if found on data object
		if (data.type) {
			this.setType(this.TYPES[data.type] || this.TYPES['default']);
		}
		else {
			this.setType(this.TYPES['default']);
		}

		//Set the message text, if it's found on the data object, or if data itself is just a string
		if (data.message) {
			this.setMessage(data.message);
		}
		else if (typeof data === "string") {
			this.setMessage(data);
		}
		else {
			//invalid message text
			console.log("Invalid Toast. The passed in param must either be a simple string with your message text, or an object containing a 'message' key.", data);
			return;
		}
		this.setOpen(true);
	}

	handleClick() {
		this.setOpen(true);
	}

	handleClose(event, reason) {
		if (reason === 'clickaway') {
			return;
		}

		this.setOpen(false);
	}

	render() {
		return (
			<div>
				<Snackbar
					className={"snackbar-toast "+this.state.type}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}

					onClick={() => this.handleClose(null, null)}

					open={this.state.open}
					autoHideDuration={this.state.duration}
					onClose={(event, reason) => this.handleClose(event,reason)}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					message={<span id="message-id">{this.state.message}</span>}
				/>
			</div>
		)
	}
}


export default Toast;
