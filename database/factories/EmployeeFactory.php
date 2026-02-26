<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uid' => fake()->unique()->numberBetween(1, 9999),
            'user_id' => strtoupper(fake()->bothify('EMP###')),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'department' => fake()->randomElement(['HR', 'Engineering', 'Finance', 'Operations', 'Sales']),
            'unit' => fake()->randomElement(['Unit A', 'Unit B', 'Unit C', null]),
            'position' => fake()->jobTitle(),
            'role' => 'user',
            'card_number' => fake()->numberBetween(0, 99999),
            'has_fingerprint' => fake()->boolean(70),
            'is_active' => true,
            'device_id' => null,
            'shift_id' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => ['is_active' => false]);
    }
}
