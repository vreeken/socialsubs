import React, { useGlobal } from 'reactn';
import PropTypes from "prop-types";

import RuntimeDisplay from "./RuntimeDisplay";
import Icon from "@material-ui/core/Icon";
import {EventBus} from "./utilities/EventBus";

const WatchBar = (props) => {
	const [movie] = useGlobal("movie");

	if (!props.active) {
		return (
			<div className="watchbar">
				<div className="menu-icon clickable">
					<Icon onClick={() => { EventBus.emit('toggleNavDrawer') }}>menu</Icon>
				</div>
			</div>
		);
	}
	return (
		<div className="watchbar">
			<div className="clickable menu-icon">
				<Icon onClick={() => { EventBus.emit('toggleNavDrawer') }}>menu</Icon>
			</div>
			<div className="movie-title">
				{movie && movie.title_short ? movie.title_short : ''}
			</div>
			<RuntimeDisplay time={props.time} updateTime={(t) => props.updateTime(t)}/>
			<div className="controls">
				{props.paused ?
					(<div className="button" onClick={() => EventBus.emit('play')}><Icon>play_circle_filled_white</Icon></div>)
					:
					(<div className="button" onClick={() => EventBus.emit('pause')}><Icon>pause_circle_filled</Icon></div>)
				}
			</div>
		</div>
	)
};

WatchBar.propTypes = {
	time: PropTypes.number,
	paused: PropTypes.bool,
	active: PropTypes.bool,
	updateTime: PropTypes.func
};

export default WatchBar;