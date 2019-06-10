import { EventBus } from "../utilities/EventBus";

/*
	A helper function to make access to the Toast Component simpler and more intuitive

	Must be used with EventBus.js, ToastComponent.js (which listens to EventBus) and <ToastComponent> must exist in the dom somewhere
	ie in Main.js:

		window.Toast = require('./components/Toast').default;

		...

		return (
			...
			<ToastComponent />
			...
		);

 */

const Toast = {
	showToast: function(message, duration = "med") {
		EventBus.emit('showToast', {message: message, duration: duration, type: "default"});
	},
	showSuccess: function(message, duration = "med") {
		EventBus.emit('showToast', {message: message, duration: duration, type: "success"});
	},
	showWarning: function(message, duration = "med") {
		EventBus.emit('showToast', {message: message, duration: duration, type: "warning"});
	},
	showError: function(message, duration = "med") {
		EventBus.emit('showToast', {message: message, duration: duration, type: "error"});
	}
};

export default Toast;