<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create([
            "first_name"=>"John",
            "last_name"=>"Smith",
            "email"=>"js@test.io",
            "role_id"=>2,
            "is_test_user"=>true
        ]);
        User::factory()->create([
            "first_name"=>"Tom",
            "last_name"=>"Smith",
            "email"=>"ts@test.io",
            "role_id"=>1,
            "is_test_user"=>false
        ]);
        User::factory(3)->create([
            "role_id"=>2
        ]);
    }
}