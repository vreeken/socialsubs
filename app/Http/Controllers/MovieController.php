<?php

namespace App\Http\Controllers;

use App\Movie;
use Storage;

class MovieController extends Controller
{
	/**
	 * Retrieve summary details for all movies
	 *
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function index() {
		$movies = Movie::all();

		return response()->json(['success'=>'success', 'movies'=>$movies], 200);
	}

	/**
	 * Show an individual movie's subtitle data
	 *
	 * We get the movie's id from the url, then use that to get the movie's tt_id, which is used to get the movies json
	 * TODO Perhaps we should rename the json files to just <movie_id>.json instead of <tt_id>.json
	 *
	 * @param Movie $movie
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function show(Movie $movie) {
		/*
		 We used to use url with tt_id, but now use movie_id
		//tt0076759
		if (!preg_match('/t{2}\d{7}/', $id)) {
			return response()->json(['error'=>'error', 'msg'=>'Invalid movie id. Must use format: tt######'], 400);
		}
		*/

		try {
			$json = Storage::disk('local')->get('json/' . $movie->tt_id . '_formatted.json');
		}
		catch (\Exception $e) {
			return response()->json(['error'=>'error', 'msg'=>'No movie data found for: '.$movie->title.'(id: '.$movie->id], 404);
		}

		return response()->json(['success'=>'success', 'json'=>$json], 200);
	}
}
