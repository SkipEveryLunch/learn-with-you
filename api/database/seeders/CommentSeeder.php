<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Question;
use App\Models\Comment;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users_count = User::count();
        $questions = Question::all()->toArray();
        $favOrUnfav = ["fav","unfav"];
        foreach($questions as $question){
            if(rand_judge(2)){
                $user_id = random_int(2,$users_count);
                Comment::factory()->create([
                    "user_id"=>$user_id,
                    "question_id"=>$question["id"]
                ]);
            }
        }
    }
}
function rand_judge($div){
    $rand = rand(1,10);
    return $rand > 10/$div ? true:false;
}