<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class HousekeepingTask extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'housekeeping_tasks';

    protected $fillable = [
        'subject',
        'location',
        'status',
        'shift',
        'assigned_to',
    ];

    public function assignedStaff()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
