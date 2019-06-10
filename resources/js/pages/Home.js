import React from "react";

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

function Home() {
	return (
		<div id="content" className="flex-center flex-col position-ref full-height content-container top-margin">
			<div className="title title-font m-b-md">
				SocialSubs
			</div>
			<div>
				Do you ever wish you could go back and watch your favorite movies for the very first time again?
				SocialSubs gives a unique and exciting new way to watch your beloved movies by displaying behind the
				scenes photos, hilarious movie mistakes, fun polls, interesting trivia questions, and timestamped user
				comments from movie fans like yourself, all while you watch the movie.
				But not only that, there is live chatting with anyone else currently watching the same movie as you.
			</div>
			<Link to="/movies">
				<CTAButton variant="contained">
					Check out our <br className="rwd-break" />growing list of movies
				</CTAButton>
			</Link>
		</div>
	);
}

export default Home;
