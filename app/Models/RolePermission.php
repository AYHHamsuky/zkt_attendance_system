<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    protected $fillable = ['role', 'permission'];

    /** Return all permission strings granted to a role (includes always-granted). */
    public static function forRole(string $role): array
    {
        $db = static::where('role', $role)->pluck('permission')->toArray();

        return array_unique(array_merge($db, \App\Permissions::ALWAYS_GRANTED));
    }
}
