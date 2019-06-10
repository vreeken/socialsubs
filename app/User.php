<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class User extends Authenticatable
{
	use Notifiable;

	/*
	STATUSes
	0 = unconfirmed                                             ACCOUNT_STATUS_UNCONFIRMED
	1 = email confirmed, in good standing, non-premium          ACCOUNT_STATUS_CONFIRMED
	2 = premium user                                            ACCOUNT_STATUS_PREMIUM
	3 = previously premium user, currently not premium          ACCOUNT_STATUS_PREV_PREMIUM
	4 = user cancelled account                                  ACCOUNT_STATUS_CANCELLED
	5 = banned                                                  ACCOUNT_STATUS_BANNED
	6 = admin                                                   ACCOUNT_STATUS_ADMIN
	*/

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'username', 'email', 'password', 'email_confirmation_code'
	];

	public static $registrationFields = [
		'username', 'email', 'password'
	];

	public static $registrationValidationRules = [
		'username' => 'required',
		'email' => 'required|email|unique:users',
		'password' => 'required|min:6'
	];

	const DEFAULT_OPTIONS = '{}';
	const USER_OPTION_KEYS = [];
	const EMAIL_CONFIRMATION_LENGTH = 20;

	/**
	 * The attributes that should be hidden for arrays.
	 *
	 * @var array
	 */
	protected $hidden = [
		'password', 'remember_token',
	];

	public static function createNew(Request $request) {
		$userData = $request->only(User::$registrationFields);
		$validator = Validator::make($userData, $registrationValidationRules);
        
        if ($validator->fails()) {
        	return response()->json(['error'=>'invalid_parameters', 'errors'=>$validator->errors()->all()], 400);
        }
		
		/*
		if (!$request->has('username') || !$request->has('email') || !$request->has('password')) {
			return response()->json(['error'=>'invalid_parameters'], 400);
		}
		*/

		// limit userData to only the essential columns
		

		/*
		//Validation
        if (strlen($userData['password']) < 6) {
            return response()->json(['error'=>'invalid_password'], 400);
        }
        if (User::where('username', $userData['username'])->exists()) {
            return response()->json(['error'=>'username_in_use'], 400);
        }
        if (User::where('email', $userData['email'])->exists()) {
            return response()->json(['error'=>'email_in_use'], 400);
        }

		if ($userData['username'] == "admin" || $userData['username'] == "administrator") {
			return response()->json(['error'=>'username_in_use'], 400);
		}
		*/

		// Hash the user's password
		$userData['password'] = Hash::make($userData['password']);

		// Create random string for email confirmation
        $userData['email_confirmation_code'] = str_random(EMAIL_CONFIRMATION_LENGTH);

		$user = User::create($userData);

		// make sure a new entry was created in the db
		if (!$user->id) {
			return response()->json(['error'=>'db_error'], 500);
		}


		$email=$request->input('email');
		try {
			Mail::send('emails.verify', array('confirmation_code' => $userData['email_confirmation_code'], 'email' => $email), 
				function($message) use($email) {
					$message
						->to($email, $email)
						->subject('Verify your email address');
				}
			);
		}
		catch(Exception $e) {
			$user->delete();
			return response()->json(['error'=>'unable_to_send_email'], 500);
		}

		$remember = ($request->has('remember') && $request->input('remember') == true);
		Auth::login($user, $remember);
		return response()->json(['success'=>'account_created']);
	}
}
