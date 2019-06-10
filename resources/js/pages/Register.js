import React from "react";

import {Link} from  'react-router-dom';

function Register() {
	return (
		<div id="content" className="flex-center flex-col position-ref full-height content-container top-margin">
			<div>
				Register a new account
			</div>
			<Link to="/login">
				Login instead
			</Link>
		</div>
	);

}

export default Register;
