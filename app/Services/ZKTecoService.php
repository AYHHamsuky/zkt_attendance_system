<?php

namespace App\Services;

use Rats\Zkteco\Lib\ZKTeco;
use App\Models\Device;
use Exception;

class ZKTecoService
{
    protected ?ZKTeco $zk = null;

    /**
     * Connect to a ZKTeco device.
     */
    public function connect(Device $device): bool
    {
        try {
            $this->zk = new ZKTeco($device->ip_address, $device->port);
            $connected = $this->zk->connect();

            if ($connected) {
                $device->update(['status' => 'online']);
            } else {
                $device->update(['status' => 'offline']);
            }

            return $connected;
        } catch (Exception $e) {
            $device->update(['status' => 'offline']);
            throw $e;
        }
    }

    /**
     * Disconnect from the device.
     */
    public function disconnect(): void
    {
        if ($this->zk) {
            $this->zk->disconnect();
            $this->zk = null;
        }
    }

    /**
     * Get device info.
     */
    public function getDeviceInfo(): array
    {
        $this->ensureConnected();

        return [
            'serial_number' => $this->zk->serialNumber(),
            'device_name' => $this->zk->deviceName(),
            'platform' => $this->zk->platform(),
            'firmware_version' => $this->zk->fmVersion(),
            'mac_address' => $this->zk->macAddress(),
        ];
    }

    /**
     * Get all users from the device.
     */
    public function getUsers(): array
    {
        $this->ensureConnected();
        return $this->zk->getUser();
    }

    /**
     * Get attendance logs from the device.
     */
    public function getAttendance(): array
    {
        $this->ensureConnected();
        return $this->zk->getAttendance();
    }

    /**
     * Set a user on the device.
     */
    public function setUser(int $uid, string $userid, string $name, string $password = '', int $role = 0, int $cardno = 0): bool
    {
        $this->ensureConnected();
        return $this->zk->setUser($uid, $userid, $name, $password, $role, $cardno);
    }

    /**
     * Remove a user from the device.
     */
    public function removeUser(int $uid): bool
    {
        $this->ensureConnected();
        return $this->zk->removeUser($uid);
    }

    /**
     * Clear attendance log on the device.
     */
    public function clearAttendance(): bool
    {
        $this->ensureConnected();
        return $this->zk->clearAttendance();
    }

    /**
     * Clear all admin privileges on the device.
     */
    public function clearAdmin(): bool
    {
        $this->ensureConnected();
        return $this->zk->clearAdmin();
    }

    /**
     * Restart the device.
     */
    public function restart(): bool
    {
        $this->ensureConnected();
        return $this->zk->restart();
    }

    /**
     * Shutdown the device.
     */
    public function shutdown(): bool
    {
        $this->ensureConnected();
        return $this->zk->shutdown();
    }

    /**
     * Enable/disable the device.
     */
    public function enable(): bool
    {
        $this->ensureConnected();
        return $this->zk->enableDevice();
    }

    public function disable(): bool
    {
        $this->ensureConnected();
        return $this->zk->disableDevice();
    }

    /**
     * Test voice on device.
     */
    public function testVoice(int $index = 0): bool
    {
        $this->ensureConnected();
        return $this->zk->testVoice($index);
    }

    /**
     * Get the ZKTeco instance.
     */
    public function getZk(): ?ZKTeco
    {
        return $this->zk;
    }

    /**
     * Ensure the device is connected.
     */
    protected function ensureConnected(): void
    {
        if (!$this->zk) {
            throw new Exception('Not connected to any device. Call connect() first.');
        }
    }
}
