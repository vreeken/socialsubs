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
	 * We get the movie's id from the url, then use that to get the movie's json data from storage
	 *
	 * @param Movie $movie
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function show(Movie $movie) {
		try {
			$json = Storage::disk('local')->get('json/' . $movie->id . '.json');
		}
		catch (\Exception $e) {
			return response()->json(['error'=>'error', 'msg'=>'No movie data found for: '.$movie->title.'(id: '.$movie->id], 404);
		}

		return response()->json(['success'=>'success', 'json'=>$json], 200);
	}
}
