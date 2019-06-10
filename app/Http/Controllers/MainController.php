<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class MainController extends Controller {
	
	public function getMain(Request $request) {
		$data['username'] = '';
		$data['logged_in'] = false;
		return view('main', ['initial_state'=>$data]);
	}

}
