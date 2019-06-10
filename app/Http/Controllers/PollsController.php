<?php

namespace App\Http\Controllers;

use App\Poll;
use DB;
use App\PollVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PollsController extends Controller {

	public function store(Request $request, Poll $poll, $option) {
		$option = (int) $option;

		//Are we logged in? If so use their login id
		if (Auth::check()) {
			$uid = Auth::user()->id;
		}
		else {
			//If we aren't logged in, we still allow poll voting on the free Star Wars movie polls
			if ($poll->movie_id===1) {
				//Use a dummy user id of 0
				$uid = 0;
			}
		}

		//Create and insert new poll vote
		if (!PollVote::create(['poll_id'=>$poll->id, 'option_id'=>$option, 'user_id'=>$uid])) {
			return response()->json(['fail'=>'db_fail', 'msg'=>'Failed to save vote'], 500);
		}

		//Get an array of the poll vote counts by option_id
		$res = DB::table('poll_votes')
			->select('option_id', DB::raw('count(*) as total'))
			->where('poll_id', $poll->id)
			->groupBy('option_id')->get();

		//Initialize an array full of zeros with the appropriate number of options for the poll
		$output = array_fill(0, $poll->option_count, 0);

		//Loop through the results and set the correct value total to the corresponding array entry
		foreach($res as $r) {
			$output[$r->option_id] = $r->total;
		}

		return response()->json(['success'=>'success', 'results'=>$output]);
	}

	
}
