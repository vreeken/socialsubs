import React, {Component} from "react";

import {Link} from  'react-router-dom';

import { styled } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const CTAButton = styled(Button)({
		background: 'linear-gradient(#F9D423 30%, #e65c00 90%)',
		//background: 'linear-gradient(#FDC830 30%, #f37335 100%)',
		border: 0,
		boxShadow: '0 3px 5px 2px rgba(249, 212, 35, .1)',
		color: '#001b3e',
		height: 68,
		padding: '10px 30px',
		marginTop: '30px',

		'&:hover': {
			background: 'linear-gradient(#e8c621 30%, #d25502 90%)',
		}
});

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}




	componentDidMount() {

	}
	componentWillUnmount() {

	}

	render() {

		return (
			<div id="content" className="flex-center flex-col position-ref full-height content-container top-margin">
				<div>
					Login
				</div>
				<Link to="/register">
					Register
				</Link>
			</div>
		);
	}
}

export default Login;
