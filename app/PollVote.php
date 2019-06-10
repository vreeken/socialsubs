<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PollVote extends Model
{
	protected $fillable = ['poll_id', 'option_id', 'user_id'];

	public function pollOption() {
		return $this->hasOne('App\PollOption');
	}

	/*public function poll()
	{
		return $this->hasOneThrough('App\Poll', 'App\PollOption');
	}*/
}
