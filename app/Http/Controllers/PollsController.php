<?php

namespace App\Http\Controllers;

use DB;
use App\PollVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PollsController extends Controller {

	public function store(Request $request, $id, $option) {
		$id = (int) $id;
		$option = (int) $option;

		//Are we logged in? If so use their login id
		if (Auth::check()) {
			$uid = Auth::user()->id;
		}
		else {
			//If we aren't logged in, we still allow poll voting on the free Star Wars movie polls
			if ($id===1) {
				//Use a dummy user id of 0
				$uid = 0;
			}
		}

		if (!PollVote::create(['poll_id'=>$id, 'option_id'=>$option, 'user_id'=>$uid])) {
			return response()->json(['fail'=>'db_fail', 'msg'=>'Failed to save vote'], 500);
		}

		//Get an array of the poll vote counts by option_id
		$res = DB::table('poll_votes')
			->select(DB::raw('count(*) as total'))
			->where('poll_id', $id)
			->groupBy('option_id')
			->pluck('total')->all();

		return response()->json(['success'=>'success', 'results'=>$res], 200);
	}

	
}
