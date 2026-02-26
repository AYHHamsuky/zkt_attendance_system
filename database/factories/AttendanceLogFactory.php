<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceLog>
 */
class AttendanceLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uid' => fake()->numberBetween(1, 9999),
            'employee_id' => null,
            'device_id' => null,
            'timestamp' => fake()->dateTimeBetween('-30 days', 'now'),
            'state' => 0,
            'type' => 1,
        ];
    }

    public function checkIn(): static
    {
        return $this->state(fn (array $attributes) => ['state' => 0]);
    }

    public function checkOut(): static
    {
        return $this->state(fn (array $attributes) => ['state' => 1]);
    }
}
