<?php


Route::get('/{any}', 'MainController@getMain')->where('any', '.*');

/*
Route::get('login/github', 'Auth\LoginController@redirectToProvider');
Route::get('login/github/callback', 'Auth\LoginController@handleProviderCallback');
*/
