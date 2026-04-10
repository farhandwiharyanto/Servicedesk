<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class MaintenanceSchedule extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $casts = [
        'next_run' => 'datetime',
    ];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
