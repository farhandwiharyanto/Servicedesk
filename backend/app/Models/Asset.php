<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class Asset extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function state()
    {
        return $this->belongsTo(AssetState::class, 'state_id');
    }

    public function type()
    {
        return $this->belongsTo(AssetType::class, 'type_id');
    }

    public function maintenances()
    {
        return $this->hasMany(MaintenanceSchedule::class);
    }
}
