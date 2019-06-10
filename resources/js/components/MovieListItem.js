import React from 'react';
import PropTypes from 'prop-types';

const MovieListItem = ( props ) => {

	return (
		<div className="movie-listitem" onClick={props.click}>
			<p>{props.title}</p>
		</div>
	)
};

MovieListItem.propTypes = {
	title: PropTypes.string,
	click: PropTypes.func
};

export default MovieListItem;