<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMovieVotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movie_votes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('movie_id');
			$table->unsignedBigInteger('user_id');
			$table->unsignedTinyInteger('vote');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('movie_votes');
    }
}
