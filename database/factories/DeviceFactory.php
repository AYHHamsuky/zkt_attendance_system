<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Device>
 */
class DeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true).' Device',
            'ip_address' => fake()->localIpv4(),
            'port' => 4370,
            'connection_type' => 'lan',
            'purpose' => 'attendance',
            'serial_number' => strtoupper(fake()->bothify('??######')),
            'device_name' => fake()->bothify('ZK-???'),
            'platform' => 'ZEM800',
            'firmware_version' => '6.60',
            'mac_address' => fake()->macAddress(),
            'location' => fake()->word().' Gate',
            'status' => 'online',
            'last_synced_at' => now(),
        ];
    }
}
