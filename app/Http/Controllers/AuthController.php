<?php

namespace App\Http\Controllers;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Hash;
//use Illuminate\Support\Facades\Validator;
//use Illuminate\Foundation\Auth\RegistersUsers;

class AuthController extends Controller {
	/*
	|--------------------------------------------------------------------------
	| Register Controller
	|--------------------------------------------------------------------------
	|
	| This controller handles the registration of new users as well as their
	| validation and creation. By default this controller uses a trait to
	| provide this functionality without requiring any additional code.
	|
	*/

	//use RegistersUsers;



	public function create(Request $request) {
		return User::createNew(Request $request);
	}
	/********************************************************
							SOCIALITE
	********************************************************/
	/**
	 * Redirect the user to the Google authentication page.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function redirectToProvider(Request $request) {
		if (!$request->has('client')) {
			return 'Missing Provider';
		}
		$provider = $request->input('client');
		if ($provider === 'google' || $provider === 'facebook') {
			return Socialite::driver($provider)->redirect();
		}
		else {
			return 'Invalid Provider';
		}
	}

	/**
	 * Obtain the user information from Google.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function handleProviderCallback(Request $request) {
		if (!$request->has('client')) {
			return 'Missing Provider';
		}

		$provider = $request->input('client');
		if ($provider === 'google' || $provider === 'facebook') {
			try {
				$user = Socialite::driver($provider)->user();
			} catch (\Exception $e) {
				return redirect('/login');
			}
		}
		else {
			return 'Invalid Provider';
		}

		if (!$user) {
			return 'Unable to validate';
		}
		
		// check if they're an existing user
		$existingUser = User::where('email', $user->getEmail())->first();
		if ($existingUser) {
			// log them in
			auth()->login($existingUser, true);
		} else {
			//TODO REDIRECT TO CREATE PAGE WITH USERNAME - crete middleware that checks if they have a username, if not redirect to input
			// create a new user
			$newUser                  = new User;
			$newUser->username        = NULL;
			$newUser->email           = $user->getEmail();
			$newUser->status 		  = 1;

			$newUser->save();
			auth()->login($newUser, true);
		}
		return redirect()->to($redirectTo);
	}















	public function createPasswordReset(Request $request) {
		if (!$request->has('email')) {
			return response()->json(['error'=>'missing_data'], 400);
		}

		$email = $request->input('email');
		$rand = str_random(EMAIL_CONFIRMATION_LENGTH);

		//Make sure token is unique
		while (PasswordReset::where('token', $rand)->count()!=0) {
			$rand = str_random(EMAIL_CONFIRMATION_LENGTH);			
		}

		if (User::where('email', $email)->count() == 0) { return response()->json(['error'=>'invalid_email'], 400); }

		$pr = PasswordReset::firstOrNew(array('email' => $email));
		$pr->token = $rand;
		if ($pr->save()) {
			try {
				Mail::send('emails.reset', array('token' => $rand, 'email' => $email), function($message) use($email) {
					$message->to($email, $email)
						->subject('Reset your password');
				});
				return response()->json(['success'=>'email_sent']);
			}
			catch(Exception $e) {
				$pr->delete();
				return response()->json(['error'=>'could_not_create_reset'], 500);
			}
		}
		return response()->json(['error'=>'db_error'], 500);
	}

	public function showResetPassword(Request $request) {
		//TODO create basic form with two inputs, post to self with hidden token
		if (!$request->has('t')) {
			return "Invalid Token";
		}
		$t = $request->input('t');
		return view('auth/reset_pw')->with('t', $t);
	}

	public function resetPassword(Request $request) {
		if (!$request->has('t') || !$request->has('password')) { return response()->json(['error'=>'missing_data'], 400); }

		$pr = PasswordReset::where('token', $request->input('t'))->first();
		if (!$pr) { return response()->json(['error'=>'invalid_email'], 400); }
		if ($pr->token != $request->input('t')) { return response()->json(['error'=>'invalid_reset_token'], 400); }

		$user = User::where('email', $pr->email)->first();
		if (!$user) { response()->json(['error'=>'invalid_email'], 400); }

		$user->password = Hash::make($request->input('password'));
		if ($user->save()) {
			$pr->delete();
			return response()->json(['success'=>'password_updated_successfully']);
		}
		return response()->json(['error'=>'db_error'], 500);
	}

	public function login(Request $request) {
		$credentials = $request->only('email', 'password');

		/*
		//TO USE USERNAME INSTEAD OF EMAIL
        // Change email to username
        $credentials = $request->only('username', 'password');
        */

		try {
			// verify the credentials and create a token for the user
			if (! $token = JWTAuth::attempt($credentials)) {
				return response()->json(['error'=>'invalid_credentials'], 401);
			}
		} catch (JWTException $e) {
			// something went wrong
			return response()->json(['error'=>'could_not_create_token'], 500);
		}
		$user = Auth::User();
		//make sure the user has verified their email
		/*
		if ($user->account_status == ACCOUNT_STATUS_UNCONFIRMED) {
			return response()->json(['error'=>'account_unconfirmed'], 401);
		}
		*/

		// if no errors are encountered we can return a JWT
		return response()->json(['jwt'=>$token, 'id'=>$user->id, 'username'=>$user->username, 'email'=>$user->email, 'account_status'=>$user->account_status]);
	}
	public function getWebLogin(Request $request) {
		Auth::logout();
		return view('auth.login');
	}
	public function postWebLogin(Request $request) {
		$remember = ($request->has('remember') && $request->input('remember')==true);

		$credentials = $request->only('email', 'password');

		//Authenticate the user with session-based authentication
		if (!Auth::attempt($credentials, $remember)) {
			return response()->json(['error'=>'invalid_credentials1'], 401);
		}

		$user = Auth::User();

		//Also get a jwt for api calls
		try {
			// verify the credentials and create a token for the user
			if (! $token = JWTAuth::attempt($credentials)) {
				return response()->json(['error'=>'invalid_credentials2'], 401);
			}
		} catch (JWTException $e) {
			// something went wrong
			return response()->json(['error'=>'could_not_create_token'], 500);
		}

		// if no errors are encountered we can return a JWT
		return response()->json(['jwt'=>$token, 'id'=>$user->id, 'username'=>$user->username, 'email'=>$user->email, 'account_status'=>$user->account_status]);
	}

	public function confirm(Request $request) {
		if (!$request->has('c') || strlen($request->input('c')) != EMAIL_CONFIRMATION_LENGTH) {
			if ($request->has('app')) {
				return response()->json(['error'=>'invalid_code'], 400);
			}
			else {
				return view('auth.confirm', ['output'=>'Invalid Code']);
			}
		}

		$user = User::whereEmailConfirmationCode($request->input('c'))->first();
		if (!$user || $user->account_status != ACCOUNT_STATUS_UNCONFIRMED) {
			if ($request->has('app')) {
				return response()->json(['error'=>'invalid_code'], 400);
			}
			else {
				return view('auth.confirm', ['output'=>'Invalid Code']);
			}
		}

		$user->account_status = ACCOUNT_STATUS_CONFIRMED;
		$user->email_confirmation_code = null;

		if (!$user->save()) {
			if ($request->has('app')) {
				return response()->json(['error'=>'db_error'], 500);
			}
			else {
				return view('auth.confirm', ['output'=>'Database Error, please try again.']);
			}
		}

		if ($request->has('app')) {
			$token = JWTAuth::fromUser($user);
			return response()->json(['success'=>'account_verified', 'jwt'=>$token]);
		}
		else {
			return view('auth.confirm', ['output'=>'success']);
		}
	}

	public function postLogout(Request $request) {
		Auth::logout();
		return redirect('/');
	}
}
