<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PollOption extends Model
{
    //


	public function poll() {
		return $this->hasOne('App\Poll');
	}
	public function votes() {
		return $this->hasMany('App\PollVote');
	}
}
