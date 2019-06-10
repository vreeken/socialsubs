import React from 'react';
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import makeStyles from "@material-ui/core/styles/makeStyles";

const editStyle = makeStyles(theme => ({
	root: {
		border: '1px solid #e2e2e1',
		overflow: 'hidden',
		borderRadius: 4,
		backgroundColor: '#fcfcfb',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		'&:hover': {
			backgroundColor: '#fff',
		},
		'&$focused': {
			backgroundColor: '#fff',

			borderColor: theme.palette.primary.main,
		},
	},
	focused: {},
}));

const EditTimeInput = function(props) {
	const classes = editStyle();

	return <TextField className={"edit-time-input"} type={"number"} variant="filled" InputProps={{ classes, disableUnderline: true }} {...props} />;
};

class RuntimeDisplay extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			editing: false,
			hour: 0,
			minute: 0,
			second: 0,
			time: props.time
		};

		this.handleChange = this.handleChange.bind(this);
	}

	setHour(h) {
		this.setState({hour:h});
	}
	setMinute(m) {
		this.setState({minute: m});
	}
	setSecond(s) {
		this.setState({second: s});
	}
	setEditing(b) {
		this.setState({editing: b});
	}

	startEditing() {
		let t = this.props.time;
		const h = Math.floor(t / 3600);
		t %= 3600;
		const m = Math.floor(t / 60);
		const s = t % 60;

		this.setHour(h);
		this.setMinute(m);
		this.setSecond(s);
		this.setEditing(true);
	}

	saveTime() {
		this.props.updateTime(parseInt(this.state.second) + (parseInt(this.state.minute) * 60) + (parseInt(this.state.hour) * 3600));
		this.setEditing(false);
	}


	runningTimePretty() {
		let t = this.props.time;
		const h = Math.floor(t / 3600);
		t %= 3600;
		const m = Math.floor(t / 60);
		const s = t % 60;

		const sh = h < 10 ? "0" + h.toString() : h.toString();
		const sm = m < 10 ? "0" + m.toString() : m.toString();
		const ss = s < 10 ? "0" + s.toString() : s.toString();

		return sh + ":" + sm + ":" + ss;
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	render() {
		if (this.state.editing) {
			return (
				<div className={"timer timer-edit"}>
					<EditTimeInput
						label="Hours"
						value={this.state.hour}
						onChange={this.handleChange}
						name={"hour"}
					/>
					<EditTimeInput
						label="Minutes"
						value={this.state.minute}
						onChange={this.handleChange}
						name={"minute"}
					/>
					<EditTimeInput
						label="Seconds"
						value={this.state.second}
						onChange={this.handleChange}
						name={"second"}
					/>

					<Button onClick={() => this.saveTime()} variant="contained" color="primary"
							className={"time-edit-save-btn"}>
						Save
					</Button>
					<Button onClick={() => this.setEditing(false)} variant="contained" color="secondary" className={""}>
						Cancel
					</Button>
				</div>
			)
		}
		return (
			<div onClick={() => this.startEditing()} className={"timer"}>{this.runningTimePretty()}</div>
		)
	}
}

RuntimeDisplay.propTypes = {
	time: PropTypes.number,
	updateTime: PropTypes.func
};

export default RuntimeDisplay;