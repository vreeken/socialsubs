import React, {Component} from "reactn";
import MovieListItem from "../components/MovieListItem";
import {Link} from "react-router-dom";

//Movies uses this.global.x and this.setGlobal({x: val}), accessible from importing from "reactn"

class Movies extends Component {

	constructor(props) {
		super(props);
	}

	fetchMoviesData() {
		const _this = this;
		axios.get('api/movies')
			.then(response => {
				if (response.data && response.data.success && response.data.movies) {
					_this.processMoviesJson(response.data.movies);
				}
				else {
					console.log('Error');
					console.log(response);
					console.log(response.data);
					Toast.showError("Error retrieving movies. Please try again.");
				}
			})
			.catch(error => {
				console.log(error);
				Toast.showError("Error retrieving movies. Please try again.");
			});
	}
	processMoviesJson(json) {
		try {
			this.setGlobal({ movies: json });
		}
		catch (e) {
			Toast.showError("Error retrieving movies. Please try again.");
			console.log("Error processing movies2");
		}
	}

	componentDidMount() {
		//Check if we've already loaded movies.json
		if (this.global.movies && this.global.movies.length) {
			return;
		}
		this.fetchMoviesData();
	}

	render() {
		let liveList, soonList = null;
		if (this.global.movies) {
			const liveArray = this.global.movies.filter(function(m) { return m.status });
			const soonArray = this.global.movies.filter(function(m) { return liveArray.indexOf(m) });

			liveList = (
				<li>
					{
						liveArray.map((movie, index) => {
							return (
								<Link className="text-link" key={index} to={"/watch/"+movie.id}>
									<MovieListItem
										key={index}
										title={movie.title}/>
								</Link>
							)
						})
					}
				</li>
			);
			soonList = (
				<li>
					{
						soonArray.map((movie, index) => {
							return (
								<MovieListItem
									key={index}
									title={movie.title}/>
							)
						})
					}
				</li>
			);
		}

		return (
			<div className="flex-center flex-col position-ref full-height content-container top-margin horizontal-padding">
				<div>
					Current Movies:
				</div>
				<ul className="no-list-style">
					{liveList}
				</ul>

				<div>
					Coming Soon:
				</div>
				<ul className="no-list-style">
					{soonList}
				</ul>
			</div>
		);
	}
}

export default Movies;