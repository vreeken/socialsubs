/*
 *		Basic Event Bus Class
 * 		Essentially a Pub/Sub Design Pattern
 */
const EventBus = {
	events: {},
	emit: function(event, data) {
		if (!this.events[event]) {
			return;
		}
		this.events[event].forEach(callback => callback(data));
	},
	listen: function(event, callback) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	},
	unListen: function(event, callback) {
		this.events[event] = this.events[event].filter(function(e) {
			return e === callback;
		});
	}
};

module.exports = { EventBus };