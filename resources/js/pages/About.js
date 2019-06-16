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

function About() {
	return (
		<div id="content" className="flex-center flex-col position-ref full-height content-container top-margin">
			<div className="title title-font m-b-md">
				SocialSubs
			</div>
			<div>
				<p>
					SocialSubs is an app that you use as you watch your favorite movies. You sync SocialSubs playback with your media player, and different trivia questions, behind-the-scenes photos, facts, movie mistakes and more are displayed alongside your movie.
				</p>
				<p>
					It&apos;s a great new method of watching a movie you&apos;ve seen many times and are looking to enjoy in a unique way. Give it a try!
				</p>
			</div>
			<Link to="/movies">
				<CTAButton variant="contained">
					Check out our <br className="rwd-break" />growing list of movies
				</CTAButton>
			</Link>
		</div>
	);
}

export default About;
