import React, {Component} from "reactn";
import SubMistake from "../components/subs/SubMistake";
import SubFact from "../components/subs/SubFact";
import SubPoll from "../components/subs/SubPoll";
import SubQuestion from "../components/subs/SubQuestion";
import SubImage from "../components/subs/SubImage";
import PropTypes from "prop-types";
import WatchBar from "../components/WatchBar";

import {EventBus} from "../components/utilities/EventBus";


function Interval(workFunc, interval, errorFunc) {
	const _this = this;
	let expected, timeout;
	this.interval = interval;

	this.start = function() {
		expected = Date.now() + this.interval;
		timeout = setTimeout(step, this.interval);
	};

	this.stop = function() { clearTimeout(timeout); };

	function step() {
		const drift = Date.now() - expected;
		if (drift > _this.interval) {
			if (errorFunc) errorFunc();
		}
		workFunc();
		expected += _this.interval;
		timeout = setTimeout(step, Math.max(0, _this.interval-drift));
	}
}

class Watch extends Component {
	constructor(props) {
		super(props);

		this.STATUES = {
			"init": 0,
			"loaded": 1,
			"playing": 2,
			"paused": 3,
			"done": 4
		};

		this.state = {
			runningTime: 0,
			currentSub: null,
			currentSubIndex: -1,
			movieId: parseInt(props.match.params.id),
			movie: null,
			status: this.STATUES.init // what stage are we at: 0=loading json, 1=ready to begin for first time, 2=playing, 3=paused, 4=movie done
		};

		this.onTick = this.onTick.bind(this);
		this.onTickError = this.onTickError.bind(this);
		this.ticker = new Interval(this.onTick, 1000, this.onTickError);
	}

	componentDidMount() {
		EventBus.listen('pause', () => this.pause());
		EventBus.listen('play', () => this.play());

		//Check if we already have the movie loaded
		if (this.global.movie && this.global.movie.id === this.state.movieId) {
			this.setState({movie: this.global.movie});

			//Also check if we have a matching watchPageState saved matching this movie
			if (this.global.watchPageState.movieId === this.state.movieId) {
				this.setState(() => ({
					runningTime: this.global.watchPageState.runningTime,
					currentSub: this.global.watchPageState.currentSub,
					currentSubIndex: this.global.watchPageState.currentSubIndex,
					status: this.STATUES.paused
				}));
			}
			else {
				this.setState(() => ({ status: this.STATUES.loaded, }));
			}

			return;
		}

		//Otherwise let's get the movie data from the server
		this.fetchMovieData();
	}
	componentWillUnmount() {
		this.setGlobal(() => ({
			watchPageState: {
				runningTime: this.state.runningTime,
				currentSub: this.state.currentSub,
				currentSubIndex: this.state.currentSubIndex,
				movieId: this.state.movieId,
				status: this.STATUES.paused
			}
		}));
		this.ticker.stop();

		EventBus.unListen('pause', () => this.pause());
		EventBus.unListen('play', () => this.play());
	}

	fetchMovieData() {
		const _this = this;
		axios.get('/api/movies/' + this.state.movieId)
			.then(response => {
				if (response.data && response.data.success) {
					_this.processMovieJson(response.data.json);
				}
				else {
					console.log('Error');
					console.log(response);
					console.log(response.data);
					Toast.showError("Error retrieving data. Please try again.");
				}
			})
			.catch(error => {
				console.log(error);
				Toast.showError("Error retrieving data. Please try again.");
			});
	}
	processMovieJson(json) {
		this.setState({movie: JSON.parse(json) })
		this.setGlobal({movie: JSON.parse(json)});

		this.setState(() => ({ status: this.STATUES.loaded, }));
	}

	onTick() {
		const t = this.state.runningTime + 1;

		if (t > this.state.movie.runtime) {
			this.endMovie();
			return;
		}

		const nextSubIndex = this.state.currentSubIndex + 1;

		if (nextSubIndex < this.state.movie.subs.length && t >= this.state.movie.subs[nextSubIndex].time) {
			this.setState(() => ({
				currentSub: this.state.movie.subs[nextSubIndex],
				currentSubIndex: nextSubIndex
			}));
		}

		this.setState(() => ({
			runningTime: t
		}));
	}

	endMovie() {
		this.ticker.stop();
		this.setState({status: this.STATUES.done});
	}

	onTickError() {
		console.log('tick Error');
	}

	pause() {
		console.log("pause");
		this.ticker.stop();
		this.setState({status: this.STATUES.paused});
	}
	play() {
		console.log("play");
		this.ticker.start();
		this.setState({status: this.STATUES.playing});
	}

	beginPlaying() {
		this.setState(() => ({ status: this.STATUES.playing, }));
		this.ticker.start();
	}

	updateTimeHandler(t) {
		t = parseInt(t);

		if (t < this.state.movie.subs[0].time) {
			this.setState(() => ({
				currentSub: null,
				currentSubIndex: -1,
				runningTime: t
			}));

			return;
		}

		const len = this.state.movie.subs.length;
		let begin = 1;

		if (t>this.state.runningTime) {
			begin = this.state.currentSubIndex;
		}

		for (let i = begin; i < len; i++) {
			if (t < this.state.movie.subs[i].time) {
				this.setState(() => ({
					currentSub: this.state.movie.subs[i-1],
					currentSubIndex: i-1,
					runningTime: t
				}));
				return;
			}
		}

		this.setState(() => ({
			currentSub: this.state.movie.subs[this.state.movie.subs.length-1],
			currentSubIndex: this.state.movie.subs.length-1,
			runningTime: t
		}));

		//Toast.showError("Error updating the current time. Please try again.");
	}

	render() {
		const watchBar = (<WatchBar updateTime={(t) => this.updateTimeHandler(t)} className="watchbar" active={this.state.status > this.STATUES.loaded} paused={this.state.status === this.STATUES.paused} time={this.state.runningTime} />);

		let ret = "";
		if (this.state.status === this.STATUES.init) {
			ret = (
				<div className="watch-container ready-to-play">
					{watchBar}
					<div className="watch-content container flex-center title title-font">
						LOADING...
					</div>
				</div>
			);
		}
		else if (this.state.status === this.STATUES.loaded) {
			ret = (
				<div className="watch-container ready-to-play">
					{watchBar}
					<div className="watch-content container">
						<div className="title title-font">
							Ready
						</div>
						<div>
							<button className="ready-to-play" onClick={() => this.beginPlaying()}>
								Hit play here when you play your movie
							</button>
							<br />
							{"If you've already begun playing we'll help you sync things"}
						</div>
					</div>
				</div>
			);
		}
		else if (this.state.status === this.STATUES.done) {
			ret = (
				<div className="watch-container">
					{watchBar}
					<div className="watch-content flex-center">
						<div>Thanks for using SocialSubs</div>
					</div>
				</div>
			);
		}
		else {
			//playing or paused
			const sub = this.state.currentSub;
			let subComponent = '';

			if (sub && sub.type) {
				if (sub.type === 'm') {
					subComponent = <SubMistake sub={sub}/>;
				} else if (sub.type === 'f') {
					subComponent = <SubFact sub={sub}/>;
				} else if (sub.type === 'p') {
					subComponent = <SubPoll sub={sub}/>;
				} else if (sub.type === 'q') {
					subComponent = <SubQuestion running_time={this.state.runningTime} sub={sub}/>;
				} else if (sub.type === 'i') {
					subComponent = <SubImage sub={sub}/>;
				}
			}

			ret = (
				<div className={this.state.status === this.STATUES.paused ? "watch-container viewing paused" : "watch-container viewing"}>
					{watchBar}

					<div className="subs-container watch-content">
						{subComponent}
					</div>

				</div>
			);
		}

		return ret;
	}
}

Watch.propTypes = {
	match: PropTypes.object,
};

export default Watch;