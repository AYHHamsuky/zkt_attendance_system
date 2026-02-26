<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shift>
 */
class ShiftFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Morning Shift', 'Day Shift', 'Night Shift']),
            'department' => null,
            'unit' => null,
            'expected_check_in' => '08:00:00',
            'expected_check_out' => '17:00:00',
            'grace_period_minutes' => 15,
        ];
    }
}
