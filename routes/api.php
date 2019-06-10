<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('movies', 'MovieController@index');
Route::get('movies/{movie}', 'MovieController@show');

Route::get('comments/{movie}', 'CommentController@show');

Route::post('polls/{id}/{option}', 'PollsController@store');