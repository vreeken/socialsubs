import ReactDOM from "react-dom";
import React from "react";
import Main from "./Main";

if (document.getElementById('app')) {
	ReactDOM.render(<Main />, document.getElementById('app'));
}
